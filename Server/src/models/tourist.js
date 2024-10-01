import mongoose from "mongoose";
import  user from "./users.js";

const touristSchema = new mongoose.Schema({
  name: { 
    type: String
  },  // Password of the user
  preferences: { type: [String], required: false }, // Tourist preferences like adventure, history, etc.
  tripsTaken: { type: [String], required: false }, // Array of trip IDs taken by the tourist
});

const tourist = user.discriminator("Tourist", touristSchema);

export default tourist;
