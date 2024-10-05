import mongoose from "mongoose";
import user from "./user.js";

const sellerSchema = new mongoose.Schema({
  description: { type: String, required: true },
});

const Seller = user.discriminator("Seller", sellerSchema);

export default Seller;
