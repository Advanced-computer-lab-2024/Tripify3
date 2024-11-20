import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  }, // Reference to the tourist booking the trip

  date: { type: Date, default: Date.now },
  paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Paid" },
  details: {
    type: String,
  },
  tickets: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  itinerary: { type: mongoose.Schema.Types.ObjectId, ref: "Itinerary" },
  place: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
  type: { type: String, enum: ["Activity", "Itinerary", "Hotel", "Flight", "Transportation", "Place"], required: true },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
