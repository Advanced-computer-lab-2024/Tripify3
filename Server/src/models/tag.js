import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const tag = mongoose.model('Tag', categorySchema);

export default tag;
