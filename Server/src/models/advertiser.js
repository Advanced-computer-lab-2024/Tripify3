import mongoose from "mongoose";
import user from "./users.js";

const advertiserSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  // adBudget: { type: Number, required: true },
  description: { type: String },
  website: { type: String },
  hotline: { type: String },
  // advertiserTaxCard: { type: String },
});

const advertiser = user.discriminator("Advertiser", advertiserSchema);

export default advertiser;
