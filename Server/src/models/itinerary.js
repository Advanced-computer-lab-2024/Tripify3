import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({

  activities:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  }
  ],
  locations: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location' 
  }],  // Array of locations in the itinerary
  price: { 
    type: Number, 
    required: true 
  },  // Total price of the itinerary
  language: {
    type: String,
  },
  timeline: {
    startTime: Date,
    endTime: Date,
  },
  price: {
    type: Number,
  },
  ratings: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Rating' 
  }],  // Array of ratings for the itinerary
  comments: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment' 
  }],  // Array of comments related to the itinerary
  budget: { 
    type: Number, 
    required: true 
  },  // Estimated budget for the itinerary
  language: { 
    type: String, 
    required: true 
  },  // Language preference for the itinerary

  availableDates: [
    {
      date: Date,
      times: [String],
    },],
    
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },

  ],
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
  }  // Preferences for the itinerary
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

export default Itinerary;
