import mongoose from "mongoose";
import user from "./user.js";

const sellerSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  description: { type: String },
});

const Seller = user.discriminator("Seller", sellerSchema);

export default Seller;
