import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the user who owns the cart
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      }, // Reference to the Product model
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      }, // Quantity of the product
    },
  ], // Array of products with quantities in the cart
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  }, // Total price of all products in the cart
  itemCount: {
    type: Number,
    required: true,
    default: 0,
  }, // Total number of products in the cart
  promoCode: {
    type: Number,
    default: 0
  }
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
