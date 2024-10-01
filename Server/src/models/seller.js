import mongoose from "mongoose";
import user from "./users.js";

const sellerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  sellerTaxCard: { type: String, required: true },
});

const seller = user.discriminator('Seller', sellerSchema);

export default seller;
