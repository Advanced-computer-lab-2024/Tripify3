const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const filghtSchema = new Schema({
  FlightNo: {
    type: Number,
    required: true,
  },
  Depatureoff_Time: {
    type: Number,
    required: true
  },
  ArrivalTime: {
    type: Number,
    required: true,
  },
  Destenation : {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const flights = mongoose.model('flights', userSchema);
module.exports = flights;