import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  }, // Reference to the tourist making the order
  discount: { 
    type: Number, 
    required: true 
  },  // Discount value of the promo code
  expiryDate: { 
    type: Date, 
    required: true 
  },  // Expiry date of the promo code
  code: { 
    type: String, 
    required: true 
  },  // Unique ID for the promo code
  used: { 
    type: Boolean, 
    required: true,
    default: false 
  },  // Unique ID for the promo code
  creationDate: { 
    type: Date, 
    default: Date.now 
  }  // Creation date of the promo code
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);


export default PromoCode;
