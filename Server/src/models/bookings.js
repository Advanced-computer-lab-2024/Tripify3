import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bookingsschema = new Schema({
  booking_id: {
    type: Number,
    required: true,
    unique:true
              },
    tourist_id: {
        type:Number,
        required:true
    }
},
 { timestamps: true });

const bookings = mongoose.model('bookings', bookingsschema);
export default bookings