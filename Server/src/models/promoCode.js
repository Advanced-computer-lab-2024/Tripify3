const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },  // Name of the promo code
  value: { 
    type: Number, 
    required: true 
  },  // Discount value of the promo code
  expiry: { 
    type: Date, 
    required: true 
  },  // Expiry date of the promo code
  id: { 
    type: String, 
    required: true 
  },  // Unique ID for the promo code
  creationDate: { 
    type: Date, 
    default: Date.now 
  }  // Creation date of the promo code
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
