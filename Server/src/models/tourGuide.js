import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    
    password: {
      type: String, 
      required: true,
    },
},
  { timestamps: true }
);

const tourguide = mongoose.model("TourGuide", userSchema);

export default tourguide;
