const mongoose = require('mongoose');
const user = require('./users.js');


const sellerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  sellerID: { type: Number, required: true },
  sellerTaxCard: { type: String, required: true },
});

const seller = user.discriminator('Seller', sellerSchema);

export default seller;
