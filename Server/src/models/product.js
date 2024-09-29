import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    // You can add more fields as needed, such as category, brand, seller_id, etc.
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
