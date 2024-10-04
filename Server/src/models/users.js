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

  // addresses: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Address",
  //   },
  // ], // Array of addresses associated with the user
  // cards: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "CardPayment",
  //   },
  // ], // Array of card payments associated with the user


});

const User = mongoose.model("User", userSchema);
export default User;