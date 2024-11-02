import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  }, // Associated with Tourist
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Refers to products
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;
