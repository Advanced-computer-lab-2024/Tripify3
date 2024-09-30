const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Could also refer to Trips
});

const wishlist = mongoose.model("Wishlist", wishlistSchema);

export default wishlist;
