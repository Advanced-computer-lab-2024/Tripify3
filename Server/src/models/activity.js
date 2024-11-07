import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isBooking: {
    type: Boolean,
    required: true,
    default: false,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  location: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  specialDiscount: {
    type: Number, // Could be a percentage or fixed amount
    default: 0,
  },
  status:{
    type:String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  price: {
    type: Number,
    required: true,
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
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advertiser",
  },
  images: {  // New field for images
    type: [String], // Array of strings to hold URLs of the images
    required: true, // Optional: mark as required if needed
  }
  , // Reference to the advertiser who posted the activity
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ], // Array of bookings for the activity
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;