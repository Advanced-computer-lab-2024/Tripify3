import mongoose from "mongoose";
import user from "./user.js";

const sellerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  }, // Email address of the user
  description: { type: String, required: true },
});

const Seller = user.discriminator("Seller", sellerSchema);

export default Seller;
