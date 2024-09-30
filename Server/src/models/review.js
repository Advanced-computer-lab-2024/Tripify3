const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: false },  // Reference to the trip being reviewed
  tourGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'TourGuide', required: false },  // Reference to the tour guide being reviewed
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist', required: true },  // Reference to the tourist writing the review
  rating: { type: Number, required: true, min: 1, max: 5 },  // Rating out of 5
  comment: { type: String, required: true },
  reviewDate: { type: Date, default: Date.now },
});

const review = mongoose.model('Review', reviewSchema);

export default review;
