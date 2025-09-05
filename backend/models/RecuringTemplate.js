const mongoose = require('mongoose');

const RecurringTemplateSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    template: Object,
    everyDays: Number,
    nextRun: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecurringTemplate', RecurringTemplateSchema);
