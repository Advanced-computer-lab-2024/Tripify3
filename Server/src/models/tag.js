import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique:true
  }
});

const Tag = mongoose.model('Tag', categorySchema);

export default Tag;
