import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, // Name of the activity
  booking:{
    type: Boolean,
    required: true,
    default: false
  },
  specialDiscount:{
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
  }, // Average rating for the activity
  date: {
    type: Date,
    required: true,
  }, // Date of the activity
  time:{
    type: String,
  },
  category: {
    type: String,
    required: true,
  }, // Category of the activity
  price: {
    type: Number,
    required: true,
  }, // Price of the activity
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  }, // Price of the activity
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
    required: true,
  }, // Reference to the advertiser who posted the activity
});

const activity = mongoose.model("Activity", activitySchema);

export default activity;
