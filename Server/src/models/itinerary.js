import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  locations: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Location' 
  }],  // Array of locations in the itinerary
  price: { 
    type: Number, 
    required: true 
  },  // Total price of the itinerary
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
  date: { 
    type: Date, 
    required: true 
  },  // Date of the itinerary
  language: { 
    type: String, 
    required: true 
  },  // Language preference for the itinerary
  preferences: { 
    type: [String], 
    enum: ['Historical Area', 'Beaches', 'Family Friendly', 'Shopping'], 
    required: true 
  }  // Preferences for the itinerary
});

const itinerary = mongoose.model('Itinerary', itinerarySchema);

export default itinerary;
