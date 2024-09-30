const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },  // Reference to the user who rated
  value: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },  // Rating value (1 to 5)
  date: { 
    type: Date, 
    default: Date.now 
  }
});

const rating = mongoose.model('Rating', ratingSchema);

export default rating;
