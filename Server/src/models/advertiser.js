import mongoose from "mongoose";
import user from "./users.js";

const advertiserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  }, // Email address of the user
  companyName: { type: String, required: true },
  description: { type: String },
  website: { type: String },
  hotline: { type: String },
  // advertiserTaxCard: { type: String },
});

const Advertiser = user.discriminator("Advertiser", advertiserSchema);

export default Advertiser;
