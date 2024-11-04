import mongoose from "mongoose";
import Tourist from "./tourist.js"; 

const paymentSchema = new mongoose.Schema({
  tourist:   {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true
  },
  paymentDate: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Credit Card", "PayPal", "Bank Transfer"], required: true },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: "pending" },
  items: [{
    type: { type: String, enum: ['Product', 'Activity', 'Itinerary', 'Place', 'Event'] },
    itemId: { type: Schema.Types.ObjectId },
    price: Number,
  }],
});

const Payment = mongoose.model("Payment", paymentSchema);

paymentSchema.post("save", async function (payment) {
  if (payment.paymentStatus === "Success") {
    try {
      const booking = await mongoose.model("Booking").findById(payment.booking).populate("tourist");
      if (booking && booking.tourist) {
        const tourist = booking.tourist;
        
        let pointsMultiplier = 0.5;
        if (tourist.level === 2) pointsMultiplier = 1;
        if (tourist.level === 3) pointsMultiplier = 1.5;
        
        const pointsToAdd = payment.amount * pointsMultiplier;

        tourist.loyaltyPoints += pointsToAdd;
        await tourist.save();
      }
    } catch (error) {
      console.error("Error updating loyalty points:", error);
    }
  }
});

export default Payment;
