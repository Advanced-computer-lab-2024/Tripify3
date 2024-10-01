import mongoose from "mongoose";
import user from "./users.js" ;

const tourGuideSchema = new mongoose.Schema({
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
  adminLevel: {
    type: String,
  },
  department: {
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
  tourGuideID: {
    type: Number,
  },
  tourGuideCertificate: {
    type: String,
  },
  advertiserID: {
    type: Number,
  },
  advertiserTaxCard: {
    type: String,
  },
  sellerID: {
    type: Number,
  },
  sellerTaxCard: {
    type: String,
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

const tourGuide = user.discriminator("Tour Guide", tourGuideSchema);

export default tourGuide;
