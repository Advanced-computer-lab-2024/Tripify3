import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  }, // Username of the user
  email: {
    type: String,
    required: true,
    unique: true,
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

});

const User = mongoose.model("User", userSchema);
export default User;