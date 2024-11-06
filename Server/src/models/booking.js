import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  // trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true }, // Reference to the trip being booked
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  }, // Reference to the tourist booking the trip
  bookingDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  }, // Status of the booking
  totalPrice: { type: Number, required: true }, // Total price for the booking
  paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  }, // Reference to the tourist booking the trip
  date: {
    type: Date,
    default: Date.now,
  },
  price: {
    type: Number,
    required: true,
  }, 
  itinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
  activity: { type:  mongoose.Schema.Types.ObjectId, ref: 'Activity' },
  type: { type: String, enum: ["Hotel", "Flight", "Activity", "Event", "Itinerary"], required: true },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
