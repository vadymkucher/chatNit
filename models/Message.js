const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, 'Please add a author']
  },
  message: {
    type: String,
    required: [true, 'Please add an message'],
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Message', MessageSchema);
