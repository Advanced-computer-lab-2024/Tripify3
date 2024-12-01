import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  inappropriate:{
    type: Boolean,
    default: false
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
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
  rating: {
    type: Number,
    default: 5,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  price: {
    type: Number,
    required: true,
  },
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
  status:{
    type:String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },
  images: {  // New field for images
    type: [String], // Array of strings to hold URLs of the images
    required: true, // Optional: mark as required if needed
  }
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;