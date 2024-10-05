import mongoose from "mongoose";
import user from "./user.js";

const advertiserSchema = new mongoose.Schema({
  companyName: { type: String },
  website: { type: String },
  hotline: { type: String },
  // advertiserTaxCard: { type: String },
});

const Advertiser = user.discriminator("Advertiser", advertiserSchema);

export default Advertiser;
