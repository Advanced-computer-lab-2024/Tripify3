import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true }, // Reference to the booking
  paymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Credit Card", "PayPal", "Bank Transfer"], required: true },
  paymentStatus: { type: String, enum: ["Success", "Failed"], default: "Success" },
});

const payment = mongoose.model("Payment", paymentSchema);

export default payment;
