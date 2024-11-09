import mongoose from "mongoose";
import User from "./user.js";

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    filepath: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
); // Keeps _id automatically

const tourGuideSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "Tour Guide",
  },
  name: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  previousWork: [
    {
      type: String,
    },
  ],
  phoneNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Rejected", "Accepted"],
    required: true,
    default: "Pending",
  },
  rating: {
    type: Number,
    default: 5,
  },
  files: [fileSchema],
  licenseNumber: {
    type: String,
  },
  itineraries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerary",
    },
  ],
  profilePicture: {
    filename: String,
    filepath: String, // This will store the path or URL to the profile picture
  },
});

const TourGuide = User.discriminator("Tour Guide", tourGuideSchema);
export default TourGuide;
