import mongoose from "mongoose";
import user from "./user.js";

const sellerSchema = new mongoose.Schema({
  description: { type: String, required: true },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Rejected", "Accepted"],
    required: true,
    default: "Pending",
  },
});

const Seller = user.discriminator("Seller", sellerSchema);

export default Seller;
