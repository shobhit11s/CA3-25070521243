const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema(
  {
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
      index: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Milestone title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Milestone amount is required'],
      min: [1, 'Amount must be at least $1'],
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Submitted', 'Approved'],
      default: 'Pending',
      index: true,
    },
    submissionNotes: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Milestone', milestoneSchema);
