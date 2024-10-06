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
  

});

const TourGuide = User.discriminator("Tour Guide", tourGuideSchema);

export default TourGuide;
