const mongoose = require('mongoose');

const advertiserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User
  companyName: { type: String, required: true },
  adBudget: { type: Number, required: true },
  description: { type: String },
  website: { type: String },
  hotline: { type: String },
  advertiserID: { type: Number, required: true },
  advertiserTaxCard: { type: String },
});

module.exports = mongoose.model('Advertiser', advertiserSchema);
