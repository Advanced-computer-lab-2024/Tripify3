import mongoose from "mongoose";
import User from "./user.js";

const tourGuideSchema = new mongoose.Schema({
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
  licenseNumber: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Pending", "Rejected", "Accepted"],
    required: true,
    default: "Pending",
  }, 
  itineraries:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Itinerary",
    },
  ],
  profilePicture: {
    filename: String,
    filepath: String, // This will store the path or URL to the profile picture
  },
  files: [
    {
      filename: String,
      filepath: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

const TourGuide = mongoose.model('Tour Guide', tourGuideSchema);
export default TourGuide;
