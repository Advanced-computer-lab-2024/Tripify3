import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Resolved'], 
    default: 'Pending' 
  },
  adminReplies: {
    type: [String], // Array of strings to hold replies
    default: [], // Default to an empty array
  },
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
