import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, // Name of the activity
  rating: {
    type: Number,
    default: 0,
  }, // Average rating for the activity
  budget: {
    type: Number,
    required: true,
  }, // Estimated budget for the activity
  date: {
    type: Date,
    required: true,
  }, // Date of the activity
<<<<<<< HEAD
  time:{
    type: String,
  },
=======
>>>>>>> d3b1252406c0ac6d018a99fee5513e25423d9202
  category: {
    type: String,
    required: true,
  }, // Category of the activity
  price: {
    type: Number,
    required: true,
  }, // Price of the activity
<<<<<<< HEAD
  location: {
    type: String,
    required: true,
  }, // Location of the activity (can store address or coordinates)
  special_discounts: {
    type: String,
  }, // Special discounts for the activity
  booking_open: {
    type: Boolean,
    default: true,
  }, // Whether booking is open for this activity
=======
>>>>>>> d3b1252406c0ac6d018a99fee5513e25423d9202
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
  advertiser: {
    type: mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
    ref: "Users",
    required: true,
  }, // Link to the advertiser (User)
}, { timestamps: true }); 
=======
    ref: "Advertiser",
    required: true,
  }, // Reference to the advertiser who posted the activity
});
>>>>>>> d3b1252406c0ac6d018a99fee5513e25423d9202

const activity = mongoose.model("Activity", activitySchema);

export default activity;
