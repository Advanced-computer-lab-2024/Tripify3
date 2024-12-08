import Seller from "../../models/seller.js"; // Adjust the path as necessary
import Product from "../../models/product.js"; // Adjust the path as necessary
import Order from "../../models/order.js"; // Adjust the path as necessary
import User from "../../models/user.js"; // Adjust the path as necessary
import Cart from "../../models/cart.js"; // Adjust the path as necessary // Adjust the path as necessary
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

// Simulate __dirname for ES6
const __filename = fileURLToPath(import.meta.url);
const currentPath = path.dirname(__filename);
import fs from "fs";
import PromoCode from "../../models/promoCode.js";
const indexOfSrc = currentPath.indexOf("src/");

// Extract everything before "src/"
const __dirname = currentPath.substring(0, indexOfSrc);

export const getAllProductImages = (req, res) => {
  const { sellerId, productName } = req.params;

  // Construct the full path to the seller's directory
  const dirPath = path.join(__dirname, "uploads", sellerId);

  // Read the directory to get all files
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: "Error reading directory" });
    }

    // Filter files to match the pattern: productName-n.png or productName-n.jpeg
    const productImages = files.filter((file) => {
      const regex = new RegExp(`^${productName}-\\d+\\.(png|jpeg|jpg)$`, "i");
      return regex.test(file); // Match product name followed by -n and correct extension
    });

    // Check if any files were found
    if (productImages.length === 0) {
      return res.status(404).json({ message: "No images found for this product" });
    }

    // Send the list of product image names
    return res.json(productImages);
  });
};

export const deleteImage = async (req, res) => {
  const { sellerId, filename } = req.params;

  // Construct the full file path to the requested image
  const filePath = path.join(__dirname, "src", "uploads", sellerId, filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If the file does not exist, return a 404 error
      return res.status(404).json({ message: "File not found" });
    }

    // If the file exists, delete it
    fs.unlink(filePath, async (err) => {
      if (err) {
        // Handle any errors while deleting the file
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Error deleting file" });
      }

      try {
        // Extract the product name (without the suffix) by splitting at the hyphen
        const [nameA] = filename.split("-");

        // Find the product by sellerId and name
        const existingProduct = await Product.findOne({ sellerId, name: nameA });

        if (!existingProduct) {
          return res.status(404).json({ message: "Product not found" });
        }

        // Remove the image URL that matches the filename
        existingProduct.imageUrl = existingProduct.imageUrl.filter((imgUrl) => !imgUrl.includes(filename));

        // Save the updated product
        await existingProduct.save();

        // Return success message after deleting the image file and updating the database
        return res.status(200).json({
          message: `File ${filename} deleted successfully and removed from product`,
          product: existingProduct, // Optionally return the updated product
        });
      } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: "Error updating product after file deletion" });
      }
    });
  });
};

export const getImage = (req, res) => {
  const { sellerId, filename } = req.params;

  // Construct the full file path to the requested image
  const filePath = path.join(__dirname, "uploads", sellerId, filename);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If the file does not exist, return a 404 error
      return res.status(404).json({ message: "File not found" });
    }

    // If the file exists, send it
    res.sendFile(filePath, (err) => {
      if (err) {
        // Handle any errors while sending the file
        console.error("Error sending file:", err);
        res.status(500).json({ message: "Error sending file" });
      }
    });
  });
};

export const findSeller = async (req, res) => {
  try {
    const { id } = req.query;

    // Search in the Seller model
    const existingSeller = await Seller.findById(id);
    if (existingSeller) {
      return res.status(200).json(existingSeller);
    }

    // If not found in Seller, search in the User model
    const existingUser = await User.findById(id);
    if (existingUser) {
      return res.status(200).json({ name: existingUser.username });
    }

    // If not found in either model, return 404
    return res.status(404).json({ message: "Seller or user not found." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewSeller = async (req, res) => {
  try {
    const { username } = req.query; // Get the username from query parameters
    const user = await Seller.findOne({ username }).select("-__t -__v"); // Find the user by username and type 'seller'
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const updateSeller = async (req, res) => {
  const { id } = req.params; // Expecting Seller id in the route parameters
  const { name, description } = req.body; // Expecting name and description in the request body

  try {
    const user = await Seller.findByIdAndUpdate(
      id, // Search by id
      { name: name, description: description }, // Fields to update
      { new: true } // Return the updated document
    ).select("-__t -__v");

    if (!user) {
      return res.status(404).json({ message: "Seller not found." });
    }
    if (user.type !== "Seller") {
      return res.status(400).json({ message: "User is not a seller." });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { userId, userType, name, price, details, quantity, category } = req.body;

    if (!name || !price || !details || !quantity || !category || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if a product with the same name and userId already exists
    const existingProduct = await Product.findOne({
      name,
      ...(userType === "Seller" ? { sellerId: userId } : { adminId: userId }),
    });

    if (existingProduct) {
      return res.status(400).json({ message: "A product already exists with the same name" });
    }

    // Initialize the imageUrls array
    const imageUrls = [];

    // Ensure that req.files exists and contains the uploaded images
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        imageUrls.push(file.path); // Store the path of the uploaded images
      });
    }

    // Check userType and set the appropriate field
    let newProductData = {
      name,
      price,
      details,
      quantity,
      category,
      imageUrl: imageUrls, // Store the array of image paths in imageUrl
      rating: 0, // Initialize rating to 0
      sales: 0, // Initialize sales to 0
    };

    if (userType === "Seller") {
      newProductData.sellerId = userId;
    } else if (userType === "Admin") {
      newProductData.adminId = userId;
    }

    // Create a new product using the prepared data
    const newProduct = new Product(newProductData);

    await newProduct.save();
    return res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const searchAllProducts = async (req, res) => {
  try {
    // Find products by name
    const existingProducts = await Product.find({ archived: false, isDeleted: false });

    // Modify imageUrl to replace backslashes with forward slashes
    const updatedProducts = existingProducts.map(product => ({
      ...product._doc, // Spread the product's properties
      imageUrl: product.imageUrl.map(imagePath => imagePath.replace(/\\/g, '/')) // Replace backslashes with forward slashes
    }));

    return res.status(200).json(updatedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const searchAllArchivedProducts = async (req, res) => {
  try {
    // Find products by name
    const existingProducts = await Product.find({ archived: true, isDeleted: false }); // Using regex for case-insensitive search
    // Return the found product(s)
     // Replace backslashes with forward slashes in the imageUrl field
     const updatedProducts = existingProducts.map(product => ({
      ...product._doc, // Spread the product's properties
      imageUrl: product.imageUrl.map(imagePath => imagePath.replace(/\\/g, '/')) // Replace backslashes with forward slashes
    }));

    return res.status(200).json(updatedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const editProduct = async (req, res) => {
  const {
    productId,
    name,
    price,
    details,
    quantity,
    category,
    sellerId,
    existingImages, // Extract existingImages from req.body
  } = req.body;

  try {
    // Find the product by productId
    const currentProduct = await Product.findById(productId);

    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (!currentProduct.sellerId.equals(sellerId)) {
      return res.status(400).json({ message: "This seller is not the owner." });
    }

    // Ensure existingImages is an array
    const existingImagesArray = Array.isArray(existingImages) ? existingImages : existingImages ? [existingImages] : [];

    // Get new uploaded images
    const newImages = req.files ? req.files.map((file) => file.path) : [];

    // Combine existing images and new images
    const updatedImageUrl = [...existingImagesArray, ...newImages];

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        details,
        quantity,
        category,
        imageUrl: updatedImageUrl,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found after update." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error in editProduct:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getSellerByUserName = async (req, res) => {
  try {
    const { username } = req.query;
    const seller2 = await Seller.findOne({ username });
    if (!seller2) {
      return res.status(404).json({ message: "Seller not found." });
    }
    return res.status(200).json(seller2);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { name } = req.query;

  try {
    // Attempt to delete the product
    const result = await Product.deleteOne({ name });

    // Check if the product was deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found." });
    }

    // If deleted successfully, send response
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteAllProducts = async (req, res) => {
  try {
    // Delete all products from the database
    await product.deleteMany({});
    res.status(200).json({ message: "All products deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//dont know whether to search with name or id
export const viewProductStockAndSales = async (req, res) => {
  try {
    // Retrieve all products with quantity and sales
    const products = await Product.find({}, "name quantity sales price sellerId");

    // Check if products exist
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Return the products with relevant fields
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//dont know whether to search with name or id
export const archiveProduct = async (req, res) => {
  const { id } = req.body;
  try {
    const existingProduct = await Product.findOneAndUpdate(
      { _id: id }, // Query to find the product by _id
      { archived: true }, // Update the "archived" field to true
      { new: true } // Return the updated document
    );
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(existingProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const unarchiveProduct = async (req, res) => {
  const { id } = req.body;
  try {
    const existingProduct = await Product.findOneAndUpdate(
      { _id: id }, // Query to find the product by _id
      { archived: false }, // Update the "archived" field to true
      { new: true } // Return the updated document
    );
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(existingProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const addProdImage = async (req, res) => {
  try {
    const { id, imageUrl } = req.body;

    if (!id || !imageUrl) {
      return res.status(400).json({ message: "Product ID and Image are required" });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    existingProduct.imageUrl.push(imageUrl); // Add the Base64 image string to the array
    await existingProduct.save();

    res.status(200).json({ message: "Image added successfully", existingProduct });
  } catch (error) {
    console.error("Error adding image:", error);
    res.status(500).json({ message: "Error adding image", error: error.message });
  }
};
export const getSalesHistory = async (req, res) => {
  try {
    const { name, sellerId } = req.query;
    const existingProduct = await Product.findOne({
      name,
      sellerId: sellerId,
    });

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(existingProduct.salesHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const SearchProductById = async (req, res) => {
  try {
    const { id } = req.query;
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Replace backslashes with forward slashes in the imageUrl array
    const updatedProduct = {
      ...existingProduct._doc, // Spread the product's properties
      imageUrl: existingProduct.imageUrl.map(imagePath => imagePath.replace(/\\/g, '/')) // Replace backslashes with forward slashes
    };

    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const deleteSellerAccount = async (req, res) => {
  try {
    const sellerId = req.params.id; // Get the seller ID from request parameters

    // Check if the seller exists
    const sellerExists = await Seller.findById(sellerId);
    if (!sellerExists) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    // Get all products associated with the seller
    const sellerProducts = await Product.find({ sellerId }).select("_id");
    const productIds = sellerProducts.map((product) => product._id);

    // Check for orders with a future dropOffDate and retrieve their carts
    const futureOrders = await Order.find({
      dropOffDate: { $gt: new Date() },
    }).select("cart");

    const cartIds = futureOrders.map((order) => order.cart);

    // Find carts that contain products from the seller
    const conflictingCarts = await Cart.find({
      _id: { $in: cartIds },
      "products.product": { $in: productIds },
    });

    // If there are no conflicting carts, proceed with the deletion
    if (conflictingCarts.length === 0) {
      // Mark all products associated with the seller as deleted
      await Product.updateMany({ sellerId }, { $set: { isDeleted: true } });

      // Delete the seller's account
      const deletedSeller = await Seller.findByIdAndDelete(sellerId);
      if (deletedSeller) {
        return res.status(200).json({
          success: true,
          message: "Seller account and all associated products deleted successfully.",
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Seller not found.",
        });
      }
    } else {
      // If there are conflicting carts, return an error response
      return res.status(403).json({
        success: false,
        message: "Cannot delete account. You have upcoming orders with future drop-off dates that include your products.",
      });
    }
  } catch (error) {
    // Catch any unexpected errors
    console.error("Error details:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while trying to delete the seller account.",
      error: error.message, // Include the error message for debugging purposes
    });
  }
};

export const getSellerRevenue = async (req, res) => {
  try {
    // Step 1: Get seller ID from the request parameters
    const sellerId = req.params.sellerId;

    if (!sellerId) {
      return res.status(400).json({ message: "Seller ID is required" });
    }

    // Step 2: Fetch all orders with 'Paid' status
    const paidOrders = await Order.find({ paymentStatus: "Paid" }).populate("cart");

    let totalRevenue = 0;
    let productsSold = {};

    // Step 3: Iterate over orders and calculate revenue
    for (const order of paidOrders) {
      const cart = await Cart.findById(order.cart).populate("products.product");

      for (const cartItem of cart.products) {
        const product = cartItem.product;

        if (product.sellerId && product.sellerId.toString() === sellerId.toString()) {
          // Apply promo code if available
          const promoCode = cart.promoCode;
          const revenueFromOrder = product.price * cartItem.quantity * (1 - promoCode);


          // Add product revenue to total
          totalRevenue += revenueFromOrder;

          // Track product sales details
          if (!productsSold[product._id]) {
            productsSold[product._id] = {
              productId: product._id,
              name: product.name,
              price: product.price,
              quantitySold: 0,
              revenue: 0,
              orders: [], // Replace saleDates and salesByMonth with orders
            };
          }
          productsSold[product._id].quantitySold += cartItem.quantity;
          productsSold[product._id].revenue += revenueFromOrder;

          // Add order details to the orders array
          productsSold[product._id].orders.push({
            quantity: cartItem.quantity,
            date: order.orderDate, // Order creation date
            revenue: revenueFromOrder, // Revenue for this order
          });
        }
      }
    }

    // Convert productsSold to an array for easier manipulation
    const productDetails = Object.values(productsSold);

    // Step 4: Return the response
    return res.status(200).json({
      sellerId,
      totalRevenue,
      products: productDetails,
    });
  } catch (error) {
    console.error("Error fetching seller revenue:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
