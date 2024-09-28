import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type:Number, required: true },
  tourId: { type:Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, default: 'Pending' },
  totalPrice: { type: Number, required: true }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking; // ES6 export
