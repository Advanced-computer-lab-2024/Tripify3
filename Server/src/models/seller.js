import mongoose from "mongoose";
import user from "./users.js";

const sellerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  }, // Email address of the user
  description: { type: String, required: true },
});

const seller = user.discriminator("Seller", sellerSchema);

export default seller;
