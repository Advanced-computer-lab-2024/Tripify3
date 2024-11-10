import seller from "../../models/seller.js"; // Adjust the path as necessary
import product from "../../models/product.js"; // Adjust the path as necessary
import Order from "../../models/order.js"; // Adjust the path as necessary
import { sendEmailNotification } from "../../middlewares/sendEmailOutOfstock.js"; // Adjust the path as necessary
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

// Simulate __dirname for ES6
const __filename = fileURLToPath(import.meta.url);
const currentPath = path.dirname(__filename);
import fs from "fs";
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
      return res
        .status(404)
        .json({ message: "No images found for this product" });
    }

    // Send the list of product image names
    res.json(productImages);
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
        const product2 = await product.findOne({ sellerId, name: nameA });

        if (!product2) {
          return res.status(404).json({ message: "Product not found" });
        }

        // Remove the image URL that matches the filename
        product2.imageUrl = product2.imageUrl.filter(
          (imgUrl) => !imgUrl.includes(filename)
        );

        // Save the updated product
        await product2.save();

        // Return success message after deleting the image file and updating the database
        return res.status(200).json({
          message: `File ${filename} deleted successfully and removed from product`,
          product: product2, // Optionally return the updated product
        });
      } catch (error) {
        console.error("Error updating product:", error);
        return res
          .status(500)
          .json({ message: "Error updating product after file deletion" });
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
    console.log(id);

    const seller2 = await seller.findById(id);
    if (!seller2) {
      return res.status(404).json({ message: "Seller not found." });
    }
    return res.status(200).json(seller2);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewSeller = async (req, res) => {
  try {
    const { username } = req.query; // Get the username from query parameters
    const user = await seller.findOne({ username }).select("-__t -__v"); // Find the user by username and type 'seller'
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
  const { id } = req.params; // Expecting seller id in the route parameters
  const { name, description } = req.body; // Expecting name and description in the request body

  try {
    const user = await seller
      .findByIdAndUpdate(
        id, // Search by id
        { name: name, description: description }, // Fields to update
        { new: true } // Return the updated document
      )
      .select("-__t -__v");

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
    const { name, price, details, quantity, category } = req.body;
    const sellerId = req.headers["user-id"]; // Get sellerId from headers

    if (!name || !price || !details || !quantity || !category || !sellerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const prodM = await product.findOne({ name, sellerId });
    if (prodM) {
      return res
        .status(400)
        .json({ message: "A product already exist with the same name" });
    }
    // Initialize the imageUrls array
    const imageUrls = [];

    // Ensure that req.files exists and contains the uploaded images
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        imageUrls.push(file.path); // Store the path of the uploaded images
      });
    }

    // Create a new product with the form data and image URLs
    const newProduct = new product({
      name,
      price,
      details,
      quantity,
      category,
      sellerId,
      imageUrl: imageUrls, // Store the array of image paths in imageUrl
      rating: 0, // Initialize rating to 0
      sales: 0, // Initialize sales to 0
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//need to change in FE to loop over the images need to be changed
export const searchAllProducts = async (req, res) => {
  try {
    // Find products by name
    const product2 = await product.find({ archived: false, isDeleted: false }); // Using regex for case-insensitive search
    // Return the found product(s)
    return res.status(200).json(product2);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const searchAllArchivedProducts = async (req, res) => {
  try {
    // Find products by name
    const product2 = await product.find({ archived: true, isDeleted: false }); // Using regex for case-insensitive search
    // Return the found product(s)
    return res.status(200).json(product2);
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

  // Uploaded files will be in req.files
  // existingImages will be in req.body.existingImages

  try {
    // Find the product by productId
    const currentProduct = await product.findById(productId);

    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (!currentProduct.sellerId.equals(sellerId)) {
      return res.status(400).json({ message: "This seller is not the owner." });
    }

    // Ensure existingImages is an array
    const existingImagesArray = Array.isArray(existingImages)
      ? existingImages
      : existingImages
      ? [existingImages]
      : [];

    // Get new uploaded images
    const newImages = req.files ? req.files.map((file) => file.path) : [];

    // Combine existing images and new images
    const updatedImageUrl = [...existingImagesArray, ...newImages];

    // Update the product
    const updatedProduct = await product.findByIdAndUpdate(
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
      return res
        .status(404)
        .json({ message: "Product not found after update." });
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
    const seller2 = await seller.findOne({ username });
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
  console.log(name);

  try {
    // Attempt to delete the product
    const result = await product.deleteOne({ name });

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
    const products = await product.find(
      {},
      "name quantity sales price sellerId"
    );

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
  console.log(id);
  try {
    const product2 = await product.findOneAndUpdate(
      { _id: id }, // Query to find the product by _id
      { archived: true }, // Update the "archived" field to true
      { new: true } // Return the updated document
    );
    if (!product2) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product2);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const unarchiveProduct = async (req, res) => {
  const { id } = req.body;
  try {
    const product2 = await product.findOneAndUpdate(
      { _id: id }, // Query to find the product by _id
      { archived: false }, // Update the "archived" field to true
      { new: true } // Return the updated document
    );
    if (!product2) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product2);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const addProdImage = async (req, res) => {
  try {
    const { id, imageUrl } = req.body;

    if (!id || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Product ID and Image are required" });
    }

    const product2 = await product.findById(id);
    if (!product2) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure the imageUrl is a valid Base64 string
    // const base64Regex = /^data:image\/[a-zA-Z]+;base64,/;
    // if (!base64Regex.test(imageUrl)) {
    //   return res.status(400).json({ message: "Invalid Base64 image format" });
    // }

    product2.imageUrl.push(imageUrl); // Add the Base64 image string to the array
    await product2.save();

    res.status(200).json({ message: "Image added successfully", product2 });
  } catch (error) {
    console.error("Error adding image:", error);
    res
      .status(500)
      .json({ message: "Error adding image", error: error.message });
  }
};
export const getSalesHistory = async (req, res) => {
  try {
    const { name, sellerId } = req.query;
    const product2 = await product.findOne({
      name,
      sellerId: sellerId,
    });

    console.log(product2);
    if (!product2) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product2.salesHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const SearchProductById = async (req, res) => {
  try {
    const { id } = req.query;
    const product2 = await product.findById(id);
    if (!product2) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.status(200).json(product2);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteSellerAccount = async (req, res) => {
  try {
    const sellerId = req.params.id; // Get the seller ID from request parameters

    // Check if the seller exists
    const sellerExists = await seller.findById(sellerId);
    if (!sellerExists) {
      return res
        .status(404)
        .json({ success: false, message: "Seller not found" });
    }

    // Check for any upcoming orders with a future drop-off date
    const hasUpcomingOrders = await Order.exists({
      "cart.products.product": {
        $in: await product.find({ sellerId }).select("_id"),
      },
      dropOffDate: { $gt: new Date() }, // Check if dropOffDate is in the future
    });

    if (hasUpcomingOrders) {
      return res.status(403).json({
        success: false,
        message:
          "Cannot delete account. You have upcoming orders with future drop-off dates.",
      });
    }

    // Mark all products associated with the seller as deleted
    await product.updateMany(
      { sellerId: sellerId },
      { $set: { isDeleted: true } }
    );

    // Proceed to delete the seller's account
    const deletedSeller = await seller.findByIdAndDelete(sellerId);
    if (deletedSeller) {
      return res.status(200).json({
        success: true,
        message:
          "Seller account and all associated products deleted successfully.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
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
