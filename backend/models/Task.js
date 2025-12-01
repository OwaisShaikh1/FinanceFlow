const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  // Task basic info
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Client/Business association
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientName: String, // Denormalized for quick access
  
  // Assigned user
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedToName: String, // Denormalized for quick access
  
  // Created by (CA who created the task)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Task details
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  taskType: {
    type: String,
    enum: ['GST Compliance', 'TDS Filing', 'ITR Filing', 'Tax Planning', 'Audit', 'Consultation', 'Other'],
    required: true
  },
  
  // Dates
  startDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  completedDate: Date,
  
  // Tags
  tags: [String],
  
  // Notes and attachments
  notes: String,
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: Date
  }]
}, {
  timestamps: true
});

// Index for faster queries
taskSchema.index({ createdBy: 1, status: 1, dueDate: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ client: 1 });

// Virtual for overdue status
taskSchema.virtual('isOverdue').get(function() {
  return this.status !== 'completed' && this.dueDate < new Date();
});

// Virtual for due today
taskSchema.virtual('isDueToday').get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.dueDate >= today && this.dueDate < tomorrow;
});

module.exports = mongoose.model('Task', taskSchema);
