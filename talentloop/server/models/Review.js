const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
      index: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['client_to_freelancer', 'freelancer_to_client'],
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// One review per contract per reviewer
reviewSchema.index({ contract: 1, reviewer: 1 }, { unique: true });

// Static helper to recalculate average rating for a user
reviewSchema.statics.calculateAverageRating = async function (userId) {
  const stats = await this.aggregate([
    { $match: { reviewee: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$reviewee',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  const User = mongoose.model('User');
  if (stats.length > 0) {
    await User.findByIdAndUpdate(userId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewsCount: stats[0].numReviews,
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      rating: 5.0,
      reviewsCount: 0,
    });
  }
};

// Update rating after saving review
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.reviewee);
});

module.exports = mongoose.model('Review', reviewSchema);
