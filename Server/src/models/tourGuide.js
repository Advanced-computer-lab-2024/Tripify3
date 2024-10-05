import mongoose from "mongoose";
import User from "./user.js";

const tourGuideSchema = new mongoose.Schema({
  licenseNumber: {
    type: String,
  },
  name:{
    type:String,
    required:true
  },
  experienceYears: {
    type: Number,
  },
  regionSpecialization: {
    type: String,
  },
  previousWork: [
    {
      type: String,
    },
  ],
  department: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },
  adBudget: {
    type: Number,
  },
  description: {
    type: String,
  },
  website: {
    type: String,
  },
  hotline: {
    type: String,
  },
  tourGuideCertificate: {
    type: String,
  },
  photos: [
    {
      type: String,
    },
  ],
  revenue: {
    type: Number,
  },
  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  ], // Array of ratings for the tour guide
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

const TourGuide = User.discriminator("Tour Guide", tourGuideSchema);

export default TourGuide;
