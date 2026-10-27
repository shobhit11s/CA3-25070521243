const Proposal = require('../models/Proposal');
const Project = require('../models/Project');
const Contract = require('../models/Contract');
const Milestone = require('../models/Milestone');

// @desc    Submit a proposal for a project
// @route   POST /api/proposals
// @access  Private (Freelancer only)
exports.submitProposal = async (req, res, next) => {
  try {
    const { projectId, coverLetter, bidAmount, deliveryTimeDays } = req.body;

    if (!projectId || !coverLetter || !bidAmount || !deliveryTimeDays) {
      return res.status(400).json({
        success: false,
        message: 'Please provide projectId, coverLetter, bidAmount, and deliveryTimeDays.',
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    if (project.status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: `This project is currently '${project.status}' and not accepting new proposals.`,
      });
    }

    // Check if user is the project owner
    if (project.client.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot submit a proposal to your own project.',
      });
    }

    // Prevent duplicate proposals by the same freelancer
    const existingProposal = await Proposal.findOne({
      project: projectId,
      freelancer: req.user._id,
    });

    if (existingProposal) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a proposal for this project.',
      });
    }

    const proposal = await Proposal.create({
      project: projectId,
      freelancer: req.user._id,
      coverLetter,
      bidAmount: Number(bidAmount),
      deliveryTimeDays: Number(deliveryTimeDays),
    });

    // Increment proposals count on project
    await Project.findByIdAndUpdate(projectId, {
      $inc: { proposalsCount: 1 },
    });

    res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully.',
      proposal,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all proposals for a specific project
// @route   GET /api/proposals/project/:projectId
// @access  Private (Project Owner Client or Admin)
exports.getProjectProposals = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
      });
    }

    // Must be project owner or admin
    if (
      project.client.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view proposals for this project.',
      });
    }

    const proposals = await Proposal.find({ project: req.params.projectId })
      .populate('freelancer', 'name email avatar title skills hourlyRate experienceLevel rating reviewsCount portfolioLinks')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get freelancer's submitted proposals
// @route   GET /api/proposals/my-proposals
// @access  Private (Freelancer)
exports.getMyProposals = async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id })
      .populate({
        path: 'project',
        select: 'title category budget status client activeContract createdAt',
        populate: { path: 'client', select: 'name avatar' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept proposal and hire freelancer
// @route   PUT /api/proposals/:id/accept
// @access  Private (Project Owner Client)
exports.acceptProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('project');
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found.',
      });
    }

    const project = proposal.project;

    // Verify ownership
    if (project.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept proposals for this project.',
      });
    }

    if (project.status !== 'Open') {
      return res.status(400).json({
        success: false,
        message: `Project is already '${project.status}'. Only 'Open' projects can accept proposals.`,
      });
    }

    // 1. Mark this proposal accepted
    proposal.status = 'accepted';
    await proposal.save();

    // 2. Reject other proposals for this project
    await Proposal.updateMany(
      { project: project._id, _id: { $ne: proposal._id } },
      { status: 'rejected' }
    );

    // 3. Create Contract
    const contract = await Contract.create({
      project: project._id,
      client: project.client,
      freelancer: proposal.freelancer,
      proposal: proposal._id,
      totalAmount: proposal.bidAmount,
      status: 'active',
      startDate: new Date(),
    });

    // 4. Create an initial milestone based on proposal
    await Milestone.create({
      contract: contract._id,
      project: project._id,
      title: 'Initial Project Deliverable',
      description: `Complete project deliverables according to proposal: "${proposal.coverLetter.substring(0, 100)}..."`,
      amount: proposal.bidAmount,
      dueDate: new Date(Date.now() + proposal.deliveryTimeDays * 24 * 60 * 60 * 1000),
      status: 'In Progress',
    });

    // 5. Update Project status
    project.status = 'In Progress';
    project.hiredFreelancer = proposal.freelancer;
    project.activeContract = contract._id;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Proposal accepted! Contract activated and freelancer hired.',
      contractId: contract._id,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject proposal
// @route   PUT /api/proposals/:id/reject
// @access  Private (Project Owner Client)
exports.rejectProposal = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('project');
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Proposal not found.',
      });
    }

    if (proposal.project.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this proposal.',
      });
    }

    proposal.status = 'rejected';
    await proposal.save();

    res.status(200).json({
      success: true,
      message: 'Proposal rejected.',
      proposal,
    });
  } catch (error) {
    next(error);
  }
};
