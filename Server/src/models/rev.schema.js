import mongoose from 'mongoose';

// Embedded schema for Reviews
const reviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Reference to the 'User' collection
    required: true 
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,  // Rating between 1 and 5
  },
  date: {
    type: Date,
    default: Date.now
  }
});
