import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  tourGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour Guide' },  // Reference to the tour guide being reviewed
  activity: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },  // Reference to the tour guide being reviewed
  itinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },  // Reference to the tour guide being reviewed
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'Tourist', required: true },  // Reference to the tourist writing the review
  rating: { type: Number, min: 1, max: 5 },  // Rating out of 5
  comment: { type: String, },
  reviewDate: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
