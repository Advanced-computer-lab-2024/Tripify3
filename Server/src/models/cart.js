const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },  // Reference to the user who owns the cart
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],  // Array of products in the cart
  totalPrice: { 
    type: Number, 
    required: true 
  },  // Total price of all products in the cart
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Cart', cartSchema);
