import mongoose from "mongoose";
import user from "./user.js";

const advertiserSchema = new mongoose.Schema({
  companyName: { type: String },
  websiteLink: { type: String },
  hotline: { type: String },
  // advertiserTaxCard: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Rejected", "Accepted"],
    required: true,
    default: "Pending",
  },
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

const Advertiser = user.discriminator("Advertiser", advertiserSchema);

export default Advertiser;
