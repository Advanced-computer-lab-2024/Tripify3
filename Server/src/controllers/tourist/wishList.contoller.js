import product from "../../models/product.js"; // Adjust the path as necessary
import tourist from "../../models/tourist.js"; // Adjust the path as necessary
import wishlist from "../../models/wishlist.js";

export const initializeWishList = async (req, res) => {
  const { touristId } = req.body; // Get the tourist's ID from the request body
  try {
    // Step 1: Check if the tourist exists
    const tourist2 = await tourist.findById(touristId);
    if (!tourist2) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Step 2: Check if the tourist2 already has a wishlist
    if (tourist2.wishlist) {
      return res
        .status(400)
        .json({ message: "Wishlist already initialized for this tourist" });
    }

    // Step 3: Create a new wishlist for the tourist
    const newWishlist = new wishlist({
      user: touristId, // Associate the wishlist with the tourist
      items: [], // Initialize with an empty array of items
    });
    await newWishlist.save(); // Save the wishlist to the database

    // Step 4: Update the tourist document to reference the new wishlist
    tourist2.wishlist = newWishlist._id;
    await tourist2.save(); // Save the updated tourist

    // Step 5: Return success response
    return res.status(201).json({
      message: "Wishlist initialized successfully",
      wishlist: newWishlist, // Optionally return the created wishlist
    });
  } catch (error) {
    console.error("Error initializing wishlist:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const AddProductToWishlist = async (req, res) => {
  const { id, touristId } = req.body;

  try {
    // Step 1: Find the tourist by ID
    const touristData = await tourist.findById(touristId).populate("wishlist"); // Populate the wishlist field

    if (!touristData) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Step 2: Check if the tourist has a wishlist
    let wishlist2 = touristData.wishlist;

    // If the tourist does not have a wishlist, initialize it
    if (!wishlist2) {
      const newWishlist = new wishlist({
        user: touristId, // Associate the wishlist with the tourist
        items: [], // Initialize with an empty array of items
      });
      wishlist2 = await newWishlist.save(); // Save the new wishlist
      touristData.wishlist = wishlist2._id; // Link the new wishlist to the tourist
      await touristData.save(); // Save the updated tourist data
    }

    // Step 3: Check if the product is already in the wishlist
    const product2 = await product.findById(id);
    if (!product2) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (wishlist2.items.includes(id)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Step 4: Add the product to the wishlist
    wishlist2.items.push(id);
    await wishlist2.save(); // Save the updated wishlist

    res.json({ message: "Product added to wishlist successfully" });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res.status(500).json({ message: "Failed to add product to wishlist" });
  }
};

export const getWishlist = async (req, res) => {
  const { touristId } = req.query;

  try {
    // Step 1: Find the tourist by ID
    const touristData = await tourist.findById(touristId).populate("wishlist"); // Populate the wishlist reference

    if (!touristData) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Step 2: Get the wishlist from the tourist data
    const wishlist = touristData.wishlist;

    if (!wishlist || wishlist.items.length === 0) {
      return res.status(200).json({ message: "Wishlist is empty", items: [] });
    }

    // Step 3: Get the product IDs only
    const wishlistItemIds = wishlist.items.map((item) => item.toString());

    // Step 4: Send only the product IDs as a response
    res.json({
      message: "Wishlist fetched successfully",
      items: wishlistItemIds, // Return only the product IDs
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

export const removeProductFromWishlist = async (req, res) => {
  const { id } = req.body; // Product ID to be removed
  const { touristId } = req.body; // Tourist ID

  try {
    // Step 1: Find the tourist by ID and populate the wishlist
    const touristData = await tourist.findById(touristId).populate("wishlist");

    if (!touristData) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    // Step 2: Get the tourist's wishlist
    const wishlist = touristData.wishlist;

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Step 3: Check if the product exists in the wishlist
    if (!wishlist.items.includes(id)) {
      return res.status(400).json({ message: "Product not in wishlist" });
    }

    // Step 4: Remove the product from the wishlist
    wishlist.items = wishlist.items.filter(
      (productId) => productId.toString() !== id
    );

    // Step 5: Save the updated wishlist
    await wishlist.save();

    res.json({ message: "Product removed from wishlist successfully" });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res.status(500).json({ message: "Failed to remove product from wishlist" });
  }
};
