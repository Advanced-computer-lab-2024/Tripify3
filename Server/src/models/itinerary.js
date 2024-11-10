import mongoose from "mongoose";

const itinerarySchema = new mongoose.Schema({
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
  places: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
    },
  ],
  name: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    required: true, // Ensure this is required
  },
  rating: {
    type: Number,
    default: 5 // Ensure this is required
  },
  language: {
    type: String,
    enum: ["English", "Spanish", "French", "German", "Arabic", "Russian", "Japanese", "Korean", "Italian"], // Expanded list of popular languages
    required: true, // Ensure this is required
  },
  timeline: {
    startTime: {
      type: Date,
      required: true, // Ensure start time is required
    },
    endTime: {
      type: Date,
      required: true, // Ensure end time is required
    },
  },
  availableDates: [
    {
      date: {
        type: Date,
        required: true, // Ensure date is required
      },
      times: [
        {
          type: String,
          required: true, // Ensure times are required
        },
      ],
    },  
  ],
  pickupLocation: {
    type: String,
    required: true, // Ensure pickup location is required
  },
  dropoffLocation: {
    type: String,
    required: true, // Ensure dropoff location is required
  },
  accessibility: {
    type: String,
    required: true, // Ensure accessibility is required
  },
  status:{
    type:String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },
  inappropriate:{
    type: Boolean,
    default: false
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  tourGuide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour Guide",
    required: true,
  }
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;
