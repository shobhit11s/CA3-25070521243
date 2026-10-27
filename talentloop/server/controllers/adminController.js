const User = require('../models/User');
const Project = require('../models/Project');
const Proposal = require('../models/Proposal');
const Contract = require('../models/Contract');
const Review = require('../models/Review');

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const clientsCount = await User.countDocuments({ role: 'client' });
    const freelancersCount = await User.countDocuments({ role: 'freelancer' });
    const totalProjects = await Project.countDocuments();
    const openProjects = await Project.countDocuments({ status: 'Open' });
    const inProgressProjects = await Project.countDocuments({ status: 'In Progress' });
    const completedProjects = await Project.countDocuments({ status: 'Completed' });
    const totalProposals = await Proposal.countDocuments();
    const totalContracts = await Contract.countDocuments();
    const reportedProjectsCount = await Project.countDocuments({ isReported: true });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        clientsCount,
        freelancersCount,
        totalProjects,
        openProjects,
        inProgressProjects,
        completedProjects,
        totalProposals,
        totalContracts,
        reportedProjectsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with pagination and search
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user suspension status
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (Admin only)
exports.toggleSuspendUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Do not allow suspending another admin or oneself
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot suspend an administrator account.',
      });
    }

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isSuspended ? 'suspended' : 'unsuspended'} successfully.`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reported projects for moderation
// @route   GET /api/admin/reported-projects
// @access  Private (Admin only)
exports.getReportedProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ isReported: true })
      .populate('client', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Dismiss report on a project
// @route   PUT /api/admin/projects/:id/dismiss-report
// @access  Private (Admin only)
exports.dismissReport = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { isReported: false, reportReason: '' },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Report dismissed.',
      project,
    });
  } catch (error) {
    next(error);
  }
};
