import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,

    },
    username: {
      type: String,
      required: true,

    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String, 
      required: true,
    },
    password: {
      type: String, 
      required: true,
    },
    nationality: {
      type: String, // Changed from Number to String
      required: true,
    },
    dateOfBirth: {
      type: String, 
      required: true,
      immutable: true 
    },
    occupation: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);

const tourist = mongoose.model("Tourist", userSchema);

export default tourist;
