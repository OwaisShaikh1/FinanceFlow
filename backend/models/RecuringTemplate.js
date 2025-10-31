const mongoose = require('mongoose');

const RecurringTemplateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true, index: true },
    template: Object,
    everyDays: Number,
    nextRun: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecurringTemplate', RecurringTemplateSchema);
