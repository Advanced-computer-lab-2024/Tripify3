import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  touristId :{
    type :mongoose.Schema.Types.ObjectId,
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
    enum: ["Open", "In Progress", "Resolved"],
    default: "Open",
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Resolved'], 
    default: 'Pending' 
  }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;
