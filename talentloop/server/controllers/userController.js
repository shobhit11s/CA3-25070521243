const User = require('../models/User');
const Project = require('../models/Project');
const Contract = require('../models/Contract');
const Review = require('../models/Review');

// @desc    Get public freelancer profile with stats, reviews, and completed projects
// @route   GET /api/users/freelancer/:id
// @access  Public
exports.getFreelancerProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Freelancer profile not found.',
      });
    }

    // Get completed contracts for this freelancer
    const completedContracts = await Contract.find({
      freelancer: user._id,
      status: 'completed',
    }).populate('project', 'title category budget');

    // Get reviews for this freelancer
    const reviews = await Review.find({
      reviewee: user._id,
    })
      .populate('reviewer', 'name avatar')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      profile: {
        ...user.toJSON(),
        completedProjectsCount: completedContracts.length,
        completedProjects: completedContracts.map((c) => c.project),
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured freelancers for landing page
// @route   GET /api/users/featured-freelancers
// @access  Public
exports.getFeaturedFreelancers = async (req, res, next) => {
  try {
    const freelancers = await User.find({
      role: 'freelancer',
      isSuspended: false,
    })
      .sort({ rating: -1, reviewsCount: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      freelancers,
    });
  } catch (error) {
    next(error);
  }
};
