import mongoose from "mongoose";
const Schema = mongoose.Schema;

const usersSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["tourist", "tourGuide", "admin", "advertiser", "seller", "touristGovernment"],
    },
    details: {
      phoneNumber: String,
      nationality: String,
      dateOfBirth: String,
      occupation: String,
      licenseNumber: String,
      experienceYears: Number,
      regionSpecialization: String,
      adminLevel: String,
      department: String,
      companyName: String,
      adBudget: Number,
      description: String,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", usersSchema);

export default Users;
