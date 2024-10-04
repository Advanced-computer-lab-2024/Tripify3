import mongoose from "mongoose";
import user from "./user.js";

const tourGuideSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  }, // Email address of the user
  name:{
    type:String,
    required:true
  },

  licenseNumber: {
    type: String,
    required: true,
  },
  experienceYears: {
    type: Number,
    required: true,
  },
  regionSpecialization: {
    type: String,
    required: true,
  },
  previousWork: [
    {
      type: String,
    },
  ],
  department: {
    type: String,
  },
  mobile: {
    type: String,
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
  photos :[{
    type:String
  }],
  revenue:{
    type:Number
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

const TourGuide = user.discriminator("Tour Guide", tourGuideSchema);

export default TourGuide;
