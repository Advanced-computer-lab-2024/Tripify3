const mongoose = require('mongoose');
const User = require('./User');

const advertiserSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  adBudget: { type: Number, required: true },
  description: { type: String },
  website: { type: String },
  hotline: { type: String },
  advertiserID: { type: Number, required: true },
  advertiserTaxCard: { type: String },
});

const advertiser = User.discriminator('Advertiser', advertiserSchema);


export default advertiser;
