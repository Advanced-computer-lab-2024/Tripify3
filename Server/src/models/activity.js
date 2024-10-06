import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, // Name of the activity
  isBooking: {
    type: Boolean,
    required: true,
    default: false,
  },
  specialDiscount: {
    type: Number, // Could be a percentage or fixed amount
    default: 0,
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
  advertiserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Advertiser",
  }, // Reference to the advertiser who posted the activity
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
