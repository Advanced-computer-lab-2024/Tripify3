import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  }, // Reference to the tourist making the order
  orderDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Paid" },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
  dropOffLocation: { type: String, required: true },
  dropOffDate: { type: Date, required: true },
  deliveryFee: { type: Number, required: true },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
