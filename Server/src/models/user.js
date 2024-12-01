import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  }, // Password of the user
  type: {
    type: String,
    enum: ["Tourist", "Tour Guide", "Admin", "Seller", "Tourism Governor", "Advertiser"], // Possible user roles
    required: true,
  },
  hasAcceptedTerms: {
    type: Boolean,
    default: false, // Default to false, indicating they haven't accepted yet
  },
  joinDate: {
    type: Date,
    default: Date.now, // Automatically sets the current date and time when the user is created
  },
  firstLogin: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
