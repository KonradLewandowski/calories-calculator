const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
  name: { type: String, tolower: true },
  days: { type: mongoose.Schema.ObjectId, ref: 'Day' },
});

const History = mongoose.model('History', historySchema);

module.exports = History;
