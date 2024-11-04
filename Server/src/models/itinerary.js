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
  price: {
    type: Number,
    required: true, // Ensure this is required
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
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
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
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
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
  tourGuideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour Guide",
  },
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

export default Itinerary;
