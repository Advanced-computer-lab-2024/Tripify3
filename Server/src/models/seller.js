const mongoose = require('mongoose');
const User = require('./User');


const sellerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  sellerID: { type: Number, required: true },
  sellerTaxCard: { type: String, required: true },
});

const seller = User.discriminator('Seller', sellerSchema);

export default seller;
