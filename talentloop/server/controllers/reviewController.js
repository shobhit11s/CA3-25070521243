const Review = require('../models/Review');
const Contract = require('../models/Contract');
const Project = require('../models/Project');

// @desc    Add review for a completed project contract
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { contractId, rating, comment } = req.body;

    if (!contractId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Contract ID, rating (1-5), and review comment are required.',
      });
    }

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found.' });
    }

    if (contract.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed contracts.',
      });
    }

    const userId = req.user._id.toString();
    const isClient = contract.client.toString() === userId;
    const isFreelancer = contract.freelancer.toString() === userId;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: 'You are not a participant in this contract.',
      });
    }

    const revieweeId = isClient ? contract.freelancer : contract.client;
    const role = isClient ? 'client_to_freelancer' : 'freelancer_to_client';

    // Check if review already exists
    const existing = await Review.findOne({
      contract: contractId,
      reviewer: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this contract.',
      });
    }

    const review = await Review.create({
      project: contract.project,
      contract: contractId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      role,
      rating: Number(rating),
      comment: comment.trim(),
    });

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'name avatar role')
      .populate('project', 'title');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a specific user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar role')
      .populate('project', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
