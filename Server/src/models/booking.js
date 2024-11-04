import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
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
