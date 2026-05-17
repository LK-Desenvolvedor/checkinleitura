const mongoose = require('mongoose');

const checkInSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photo: {
    type: String,
    default: ''
  },
  comment: {
    type: String,
    default: ''
  },
  chapter: {
    type: Number,
    default: null
  },
  page: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CheckIn', checkInSchema);
