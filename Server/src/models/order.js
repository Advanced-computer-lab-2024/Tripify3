const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the buyer (Tourist or other users)
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },  // Reference to the seller
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // Reference to the product being ordered
  quantity: { type: Number, default: 1 },  // Number of products ordered
  totalAmount: { type: Number, required: true },  // Total price for the order
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },  // Status of the order
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },  // Payment status
  createdAt: { type: Date, default: Date.now },  // Order creation date
  updatedAt: { type: Date, default: Date.now },  // Order last updated
});

const order = mongoose.model('Order', orderSchema);

export default order;
