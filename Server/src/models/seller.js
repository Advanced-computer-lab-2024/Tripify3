import mongoose from "mongoose";
import user from "./users.js";

const sellerSchema = new mongoose.Schema({
  description: { type: String, required: true },
});

const seller = user.discriminator("Seller", sellerSchema);

export default seller;
