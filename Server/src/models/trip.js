const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  tripName: { type: String, required: true },
  destination: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },  // Duration in days
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tourGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'TourGuide', required: true },  // Reference to the Tour Guide
  tourists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tourist' }],  // Array of tourists booked on the trip
  availableSpots: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
