import mongoose from "mongoose";
import Tourist from "./tourist.js";
import User from "./user.js";

const paymentSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  },
  paymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Visa", "Wallet", "Cash on Delivery"], required: true },
  paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Completed" },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  type: { type: String, enum: ["Activity", "Itinerary", "Product", "App Product", "Hotel", "Place", "Flight", "Transportation"] },
});

paymentSchema.post("save", async function (payment) {
  console.log("Payment saved:", payment);
  if (payment.paymentStatus === "completed") {
    try {
      const user = await User.findById(payment.tourist);
      console.log("User found:", user);

      if (user && user.type === "Tourist") {
        if (user.loyaltyPoints > 500000) {
          pointsMultiplier = 1.5;
        } else if (user.loyaltyPoints > 100000) {
          pointsMultiplier = 1;
        } else {
          pointsMultiplier = 0.5;
        }

        const pointsToAdd = payment.amount * pointsMultiplier;
        console.log(`Points to add: ${pointsToAdd}`);
        user.loyaltyPoints += pointsToAdd;

        await user.save().catch((error) => {
          console.error("Error saving user:", error);
        });

        console.log("User loyalty points updated:", user.loyaltyPoints); // Verify points update
      }
    } catch (error) {
      console.error("Error updating loyalty points:", error);
    }
  }
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
