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
      required: false,
      default: 5,
    },
    quantity: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: [String],
      required: true,
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User who is a seller
      ref: "Seller", // Referencing the Users model
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User who is a seller
      ref: "User", // Referencing the Users model
    },
    sales: {
      type: Number,
      default: 0,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    salesHistory: [
      {
        quantity: Number,
        date: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
