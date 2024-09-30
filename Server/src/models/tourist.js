const mongoose = require("mongoose");
const User = require("./User");

const touristSchema = new mongoose.Schema({
  preferences: { type: [String], required: false }, // Tourist preferences like adventure, history, etc.
  tripsTaken: { type: [String], required: false }, // Array of trip IDs taken by the tourist
});

const tourist = User.discriminator("Tourist", touristSchema);

export default tourist;
