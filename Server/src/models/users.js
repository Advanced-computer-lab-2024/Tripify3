import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  username: { 
    type: String, 
    required: true,
    unique: true 
  },  // Username of the user
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },  // Email address of the user
  password: { 
    type: String, 
    required: true 
  },  // Password of the user
  loyaltyPoints: { 
    type: Number, 
    default: 0  
  },  // Loyalty points earned by the user
  badges: [{ 
    type: String 
  }],  // Array of badges earned by the user
  type: {
    type: String,
    enum: ["tourist", "tourGuide", "admin", "seller", "touristGovernor", "advertiser"],  // Possible user roles
    required: true
  },
  complaints: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Complaint'  
  }],  // Array of complaints made by the user
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product'  
  }],  // Array of products in the user's wishlist
  addresses: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Address'  
  }],  // Array of addresses associated with the user
  cards: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CardPayment'  
  }],  // Array of card payments associated with the user
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const user = mongoose.model("User", userSchema);

export default user;
