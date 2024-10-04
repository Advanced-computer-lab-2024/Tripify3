import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  }, // Username of the user
  password: {
    type: String,
    required: true,
  }, // Password of the user
  type: {
    type: String,
    enum: ["tourist", "tourGuide", "admin", "seller", "touristGovernor", "advertiser"], // Possible user roles
    required: true,
  },

});

const User = mongoose.model("User", userSchema);
export default User;