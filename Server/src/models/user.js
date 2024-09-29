
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingschema = new mongoose.Schema({
    tourName: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled'],
        required: true
      }
    });
const userSchema = new Schema(
  {
    Type:{
        type:String,
        required:true,
        enum:['Admin','Tourist','TourGuide']
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique:true
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
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date, 
      required: true,
      immutable: true 
    },
    occupation: {
      type: String, 
      enum: ['student','job'],
      required: true,
    },
    job:{
        type:String,
    },
    bookings:[bookingschema],
  },
  { timestamps: true }
);

const user = mongoose.model("user", userSchema);

export default user;