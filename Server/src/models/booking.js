import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  }, // Reference to the tourist booking the trip

  date: { type: Date, default: Date.now },
  price: { type: Number, required: true }, // Total price for the booking

  paymentStatus: { type: String, enum: ["Paid", "Unpaid"], default: "Unpaid" },
  details: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  }, 
  type: { type: String, enum: ["Activity", "Trip", "Itinerary"], required: true },

  
  itinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
  trip: { type:  mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  activity: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
