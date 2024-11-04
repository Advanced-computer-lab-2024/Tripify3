import mongoose from "mongoose";
import User from "./user.js";

const touristSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  name: {
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
  },
  walletAmount: {
    type: Number,
    default: 0,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  complaints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
    },
  ],
  wishlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wishlist",
  },
  profilePicture: {
    filename: String,
    filepath: String, // This will store the path or URL to the profile picture
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  currencyPreference: {
    type: String,
    enum: ["USD", "CAD", "GBP", "EUR", "AUD", "EGP", "BRL", "ARS"], // Modify as needed
  },
  preferences: { 
    type: [String], 
    required: false
   },
  tripsTaken: { 
    type: [String], 
    required: false 
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "tourGuide",
  }],
  activitiesAttended:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "activity",
  }],
  itinerariesAttended:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Itinerary",
  }]
});

touristSchema.virtual("level").get(function () {
  if (this.loyaltyPoints > 500000) {
    return 3;
  } else if (this.loyaltyPoints > 100000) {
    return 2;
  } else {
    return 1;
  }
});

touristSchema.set("toJSON", { virtuals: true });
touristSchema.set("toObject", { virtuals: true });

const Tourist = User.discriminator("Tourist", touristSchema);

export default Tourist;