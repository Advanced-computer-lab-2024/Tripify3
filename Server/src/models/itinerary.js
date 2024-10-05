import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  }],
  locations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  }],
  price: { 
    type: Number, 
    required: true // Ensure this is required
  },
  language: { 
    type: String, 
    required: true // Ensure this is required
  },
  timeline: {
    startTime: Date,
    endTime: Date,
  },
  ratings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rating'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  budget: { 
    type: Number, 
    required: true 
  },
  availableDates: [{
    date: Date,
    times: [String],
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  }],
  pickupLocation: {
    type: String,
  },
  dropoffLocation: {
    type: String,
  },
  accessibility: {
    type: String,
  },
  preferences: { 
    type: [String], 
    enum: ['Historical Area', 'Beaches', 'Family Friendly', 'Shopping'], 
    required: true 
  } 
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

export default Itinerary;
