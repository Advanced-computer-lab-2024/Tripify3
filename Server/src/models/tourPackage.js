const mongoose = require('mongoose');

const tourPackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tripsIncluded: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],  // List of trips included in the package
  price: { type: Number, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },  // Total duration in days
});

module.exports = mongoose.model('TourPackage', tourPackageSchema);
