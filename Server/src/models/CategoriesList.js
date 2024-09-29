import e from "express";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,}
});

const CategoriesList = mongoose.model("CategoriesList", categorySchema);
export default CategoriesList;