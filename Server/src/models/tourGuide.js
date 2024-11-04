import mongoose from "mongoose";
import User from "./user.js";

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, { _id: true }); // Keeps _id automatically


const tourGuideSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: "Tour Guide"
    },
    name: {
        type: String,
        required: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    previousWork: [
        {
            type: String,
        },
    ],
    phoneNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Rejected", "Accepted"],
        required: true,
        default: "Pending",
    },
    ratings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Rating" // Reference to Rating model
        }
    ],
    files: [fileSchema],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment" // Reference to Rating model
        }
    ]
});

const TourGuide = User.discriminator('Tour Guide', tourGuideSchema);
export default TourGuide;