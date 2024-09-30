const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },  // Reference to the user who made the comment
  content: { 
    type: String, 
    required: true 
  },  // Content of the comment
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Comment', commentSchema);
