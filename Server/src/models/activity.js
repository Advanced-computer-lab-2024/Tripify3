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
  }, // Duration of the activity
  rating: {
    type: Number,
    default: 0,
  }, // Average rating for the activity
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  }, // Category of the activity
  price: {
    type: Number,
  }, // Price of the activity
  // Price of the activity
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  ], // Array of ratings for the activity
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ], // Array of comments related to the activity
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ], // Array of comments related to the activity
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advertiser",
  }, // Reference to the advertiser who posted the activity
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ], // Array of bookings for the activity
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
