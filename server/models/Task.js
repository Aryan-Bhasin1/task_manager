const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  dueDate: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Task', taskSchema);