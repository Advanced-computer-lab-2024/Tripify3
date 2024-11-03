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
    required: false,
    default: "Pending",
  },
  profilePicture: {
    filename: String,
    filepath: String, // This will store the path or URL to the profile picture
  },
  // Add a files field to store file information
  files: [
    {
      filename: String,
      filepath: String,
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

const Seller = user.discriminator("Seller", sellerSchema);

export default Seller;
