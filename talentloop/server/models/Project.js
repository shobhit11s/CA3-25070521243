const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Web Development',
        'Graphic Design',
        'Video Editing',
        'Content Creation',
        'Digital Marketing',
      ],
      index: true,
    },
    budget: {
      type: {
        type: String,
        enum: ['fixed', 'hourly'],
        default: 'fixed',
      },
      amount: {
        type: Number,
        required: [true, 'Budget amount is required'],
        min: [5, 'Budget must be at least $5'],
      },
    },
    skillsRequired: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Open',
      index: true,
    },
    hiredFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    activeContract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      default: null,
    },
    proposalsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isReported: {
      type: Boolean,
      default: false,
      index: true,
    },
    reportReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
projectSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Project', projectSchema);
