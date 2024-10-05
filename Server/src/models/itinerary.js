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
    startTime: {
      type: Date,
      required: true // Ensure start time is required
    },
    endTime: {
      type: Date,
      required: true // Ensure end time is required
    },
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
    date: {
      type: Date,
      required: true // Ensure date is required
    },
    times: [{
      type: String,
      required: true // Ensure times are required
    }],
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  pickupLocation: {
    type: String,
    required: true // Ensure pickup location is required
  },
  dropoffLocation: {
    type: String,
    required: true // Ensure dropoff location is required
  },
  accessibility: {
    type: String,
    enum: ['Wheelchair Accessible', 'Limited Mobility', 'Not Accessible'], // Provide specific options
    required: true // Ensure accessibility is required
  },
  preferences: { 
    type: [String], 
    enum: ['Historical Area', 'Beaches', 'Family Friendly', 'Shopping'], 
    required: true 
  } 
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

export default Itinerary;
