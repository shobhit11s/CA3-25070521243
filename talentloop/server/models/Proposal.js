const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
      index: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Freelancer reference is required'],
      index: true,
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      minlength: [20, 'Cover letter must be at least 20 characters'],
      maxlength: [3000, 'Cover letter cannot exceed 3000 characters'],
    },
    bidAmount: {
      type: Number,
      required: [true, 'Bid amount is required'],
      min: [5, 'Bid amount must be at least $5'],
    },
    deliveryTimeDays: {
      type: Number,
      required: [true, 'Delivery time is required'],
      min: [1, 'Delivery time must be at least 1 day'],
      max: [365, 'Delivery time cannot exceed 365 days'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate proposals by the same freelancer for the same project
proposalSchema.index({ project: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', proposalSchema);
