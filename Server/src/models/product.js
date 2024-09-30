const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Seller', 
    required: true 
  },  // Reference to the seller offering the product
  name: { 
    type: String, 
    required: true 
  },  // Name of the product
  description: { 
    type: String, 
    required: true 
  },  // Description of the product
  price: { 
    type: Number, 
    required: true 
  },  // Price of the product
  category: { 
    type: String, 
    required: true 
  },  // Category (e.g., gear, tour package, service)
  stockQuantity: { 
    type: Number, 
    default: 0 
  },  // Available stock
  images: { 
    type: [String], 
    required: false 
  },  // URLs to product images
  ratings: { 
    type: Number, 
    default: 0 
  },  // Average rating
  reviews: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Review' 
  }],  // List of reviews related to the product
  numberOfSales: { 
    type: Number, 
    default: 0 
  },  // Number of sales made
  isArchived: { 
    type: Boolean, 
    default: false 
  },  // Boolean flag for archiving the product
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const product = mongoose.model('Product', productSchema);


export default product;
