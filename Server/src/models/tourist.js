import mongoose from "mongoose";
import  user from "./users.js";

const touristSchema = new mongoose.Schema({
  name: { 
    type: String,
    required: true,
  },  // Password of the user
  phoneNumber: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  preferences: { type: [String], required: false }, // Tourist preferences like adventure, history, etc.
  tripsTaken: { type: [String], required: false }, // Array of trip IDs taken by the tourist
});

const tourist = user.discriminator("Tourist", touristSchema);

export default tourist;
