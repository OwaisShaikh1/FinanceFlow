  // models/UserCounter.js
const mongoose = require('mongoose');

const UserCounterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  lastSerial: { type: Number, default: 0 }
});

module.exports = mongoose.model('UserCounter', UserCounterSchema);
