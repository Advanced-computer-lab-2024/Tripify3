const mongoose = require('mongoose');
const User = require('./User');


const sellerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User
  companyName: { type: String, required: true },
  sellerID: { type: Number, required: true },
  sellerTaxCard: { type: String, required: true },
});

const seller = User.discriminator('Seller', sellerSchema);

export default seller;
