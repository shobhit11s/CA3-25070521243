const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const Contract = require('../models/Contract');

// @desc    Get all projects with search, filter, sort & pagination
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const {
      search,
      category,
      type, // 'fixed' | 'hourly'
      minBudget,
      maxBudget,
      status = 'Open',
      sort = 'newest',
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // Filter by status (allow 'all' for admin/special views)
    if (status && status !== 'all') {
      query.status = status;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Budget type filter
    if (type && ['fixed', 'hourly'].includes(type)) {
      query['budget.type'] = type;
    }

    // Budget range
    if (minBudget || maxBudget) {
      query['budget.amount'] = {};
      if (minBudget) query['budget.amount'].$gte = Number(minBudget);
      if (maxBudget) query['budget.amount'].$lte = Number(maxBudget);
    }

    // Search filter
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { skillsRequired: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // newest
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'budget-high') sortOption = { 'budget.amount': -1 };
    else if (sort === 'budget-low') sortOption = { 'budget.amount': 1 };
    else if (sort === 'proposals') sortOption = { proposalsCount: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate('client', 'name avatar rating reviewsCount location')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name email avatar rating reviewsCount location bio createdAt')
      .populate('hiredFreelancer', 'name email avatar rating title')
      .populate('activeContract');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Client only)
exports.createProject = async (req, res, next) => {
  try {
    const { title, description, category, budgetType, budgetAmount, skillsRequired, deadline } = req.body;

    if (!title || !description || !category || !budgetAmount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and budget amount.',
      });
    }

    const skills = Array.isArray(skillsRequired)
      ? skillsRequired
      : typeof skillsRequired === 'string' && skillsRequired
      ? skillsRequired.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const project = await Project.create({
      title,
      description,
      category,
      budget: {
        type: budgetType || 'fixed',
        amount: Number(budgetAmount),
      },
      skillsRequired: skills,
      deadline: deadline || null,
      client: req.user._id,
      status: 'Open',
    });

    res.status(201).json({
      success: true,
      message: 'Project posted successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private (Project owner client or Admin)
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Check ownership or admin
    if (project.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project.',
      });
    }

    const { title, description, category, budgetType, budgetAmount, skillsRequired, deadline, status } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (budgetAmount) {
      project.budget = {
        type: budgetType || project.budget.type,
        amount: Number(budgetAmount),
      };
    }
    if (skillsRequired !== undefined) {
      project.skillsRequired = Array.isArray(skillsRequired)
        ? skillsRequired
        : skillsRequired.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (deadline !== undefined) project.deadline = deadline;
    if (status && ['Open', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
      project.status = status;
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Project owner client or Admin)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    if (project.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project.',
      });
    }

    // Delete associated proposals
    await Proposal.deleteMany({ project: project._id });

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get client's own projects
// @route   GET /api/projects/my-projects
// @access  Private (Client)
exports.getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ client: req.user._id })
      .populate('hiredFreelancer', 'name avatar rating')
      .populate('activeContract')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report a project for moderation
// @route   POST /api/projects/:id/report
// @access  Private
exports.reportProject = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        isReported: true,
        reportReason: reason || 'Inappropriate content reported by user.',
      },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project reported to moderators.',
    });
  } catch (error) {
    next(error);
  }
};
