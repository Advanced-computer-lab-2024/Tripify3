import mongoose from "mongoose";
import User from "./user.js";

const tourGuideSchema = new mongoose.Schema({
  licenseNumber: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  experienceYears: {
    type: Number,
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

});

const TourGuide = User.discriminator("Tour Guide", tourGuideSchema);

export default TourGuide;
