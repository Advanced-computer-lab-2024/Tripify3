import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  paymentMethod: { type: String, required: true }, // Payment method used
  amount: { type: Number, required: true },
  status: { type: String, enum: ["Success", "Failed", "Refunded"], default: "Success" },
  transactionDate: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
