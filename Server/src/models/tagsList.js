import e from "express";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tagsSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,}
});

const tagsList = mongoose.model("tagsList", tagsSchema);
export default tagsList;