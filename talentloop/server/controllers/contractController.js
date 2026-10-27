const Contract = require('../models/Contract');
const Milestone = require('../models/Milestone');
const Project = require('../models/Project');

// @desc    Get user's contracts (active/completed)
// @route   GET /api/contracts
// @access  Private
exports.getMyContracts = async (req, res, next) => {
  try {
    const isClient = req.user.role === 'client';
    const query = isClient ? { client: req.user._id } : { freelancer: req.user._id };

    const contracts = await Contract.find(query)
      .populate('project', 'title category budget status deadline')
      .populate('client', 'name email avatar rating')
      .populate('freelancer', 'name email avatar title rating')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contracts.length,
      contracts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contract details with milestones
// @route   GET /api/contracts/:id
// @access  Private (Participant or Admin)
exports.getContractById = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('project')
      .populate('client', 'name email avatar rating reviewsCount')
      .populate('freelancer', 'name email avatar title rating reviewsCount');

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found.',
      });
    }

    const userId = req.user._id.toString();
    const isParticipant =
      contract.client._id.toString() === userId ||
      contract.freelancer._id.toString() === userId ||
      req.user.role === 'admin';

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this contract.',
      });
    }

    const milestones = await Milestone.find({ contract: contract._id }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      contract,
      milestones,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a milestone to contract
// @route   POST /api/contracts/:id/milestones
// @access  Private (Client or Admin)
exports.addMilestone = async (req, res, next) => {
  try {
    const { title, description, amount, dueDate } = req.body;
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }

    if (contract.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the client can add milestones.' });
    }

    const milestone = await Milestone.create({
      contract: contract._id,
      project: contract.project,
      title,
      description: description || '',
      amount: Number(amount),
      dueDate: dueDate || null,
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Milestone added successfully.',
      milestone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update milestone progress/status
// @route   PUT /api/contracts/milestones/:milestoneId
// @access  Private
exports.updateMilestoneStatus = async (req, res, next) => {
  try {
    const { status, submissionNotes } = req.body;
    const milestone = await Milestone.findById(req.params.milestoneId).populate('contract');

    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found.' });
    }

    const contract = milestone.contract;
    const userId = req.user._id.toString();
    const isClient = contract.client.toString() === userId || req.user.role === 'admin';
    const isFreelancer = contract.freelancer.toString() === userId;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    // Role specific state transitions:
    // Freelancer can mark 'In Progress' or 'Submitted'
    if (isFreelancer && !isClient) {
      if (['In Progress', 'Submitted'].includes(status)) {
        milestone.status = status;
        if (submissionNotes) milestone.submissionNotes = submissionNotes;
        if (status === 'Submitted') milestone.submittedAt = new Date();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Freelancers can only update status to In Progress or Submitted.',
        });
      }
    }

    // Client can approve milestone
    if (isClient) {
      if (status === 'Approved') {
        milestone.status = 'Approved';
        milestone.approvedAt = new Date();
      } else if (['Pending', 'In Progress'].includes(status)) {
        milestone.status = status;
      }
    }

    await milestone.save();

    res.status(200).json({
      success: true,
      message: `Milestone status updated to ${milestone.status}.`,
      milestone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete a contract
// @route   PUT /api/contracts/:id/complete
// @access  Private (Client or Admin)
exports.completeContract = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }

    if (contract.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the client can complete this contract.' });
    }

    contract.status = 'completed';
    contract.endDate = new Date();
    await contract.save();

    // Mark project as Completed
    await Project.findByIdAndUpdate(contract.project, {
      status: 'Completed',
    });

    res.status(200).json({
      success: true,
      message: 'Contract and project marked as Completed!',
      contract,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a contract
// @route   PUT /api/contracts/:id/cancel
// @access  Private (Client or Admin)
exports.cancelContract = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }

    if (contract.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the client can cancel this contract.' });
    }

    contract.status = 'cancelled';
    contract.endDate = new Date();
    await contract.save();

    await Project.findByIdAndUpdate(contract.project, {
      status: 'Cancelled',
    });

    res.status(200).json({
      success: true,
      message: 'Contract cancelled.',
      contract,
    });
  } catch (error) {
    next(error);
  }
};
