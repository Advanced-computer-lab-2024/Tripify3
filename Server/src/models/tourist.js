import mongoose from "mongoose";
import user from "./user.js";

const touristSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  birthDate: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
  }, // Loyalty points earned by the user
  complaints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
  ],
  wishlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wishlist", // References the Wishlist model
  },
  preferences: { type: [String], required: false },
  tripsTaken: { type: [String], required: false },
});

const Tourist = user.discriminator("Tourist", touristSchema);

export default Tourist;
