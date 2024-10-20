import React, { useState } from "react";
import axios from "axios";
import { getUserId, getUserType } from "../../utils/authUtils.js";

const EditProductForm = () => {
  const userId = getUserId(); // Get the user ID from local storage
  const userType = getUserType(); // Get the user type from local storage
  const [name, setName] = useState(""); // Product name (to search)
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState("");
  const [existingImages, setExistingImages] = useState([]); // Array to store existing image URLs
  const [newImages, setNewImages] = useState([]); // Array to store new file uploads
  const [category, setCategory] = useState("");
  const [sellerName, setSellerName] = useState(""); // Input for Seller Name (for Admin)
  const [sellerId, setSellerId] = useState(userId); // If Seller, default to userId
  const [responseMessage, setResponseMessage] = useState("");
  const [productId, setProductId] = useState(""); // Store productId

  // Fetch sellerId based on sellerName (for admins)
  const fetchSellerId = async (sellerName) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/access/seller/getSellerByUserName?username=${sellerName}`
      );
      const seller = response.data; // Assuming the response contains the seller object
      return seller._id; // Return the seller's id
    } catch (error) {
      console.error("Error fetching seller ID:", error);
      setResponseMessage("Failed to fetch seller by username.");
      throw error;
    }
  };

  // Fetch product details based on product name and sellerId
  const fetchProduct = async () => {
    try {
      let currentSellerId = sellerId;

      // If admin, fetch sellerId from sellerName
      if (userType !== "Seller" && sellerName) {
        currentSellerId = await fetchSellerId(sellerName); // Fetch sellerId from sellerName
        setSellerId(currentSellerId); // Set sellerId state for later use
      }

      const query = `?name=${name}&sellerId=${currentSellerId}`;
      const response = await axios.get(
        `http://localhost:8000/access/seller/searchProduct${query}`
      );

      const product = response.data[0]; // Assuming the first product is the correct one

      // Set product details and existing images
      setProductId(product._id);
      setPrice(product.price);
      setDetails(product.details);
      setQuantity(product.quantity);
      setCategory(product.category);
      setExistingImages(product.imageUrl || []); // Set existing image URLs
      console.log("Product details:", product);
    } catch (error) {
      setProductId("");
      setPrice("");
      setDetails("");
      setQuantity("");
      setCategory("");
      setSellerId(userType === "Seller" ? userId : "");
      setExistingImages([]);
      console.error("Error fetching product details:", error);
      setResponseMessage(error.response?.data?.message || "Product not found.");
    }
  };

  // Handle adding new files
  const handleNewImageChange = (e) => {
    const newFiles = Array.from(e.target.files); // Convert FileList to an array
    setNewImages((prevImages) => [...prevImages, ...newFiles]); // Append new files to the list
  };

  // Handle removing an existing image (by URL)
  const handleRemoveExistingImage = async (file, indexToRemove) => {
    // Optimistically remove the image from the UI
    setExistingImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );

    try {
      const response = await axios.delete(
        `http://localhost:8000/${file}?indexToRemove=${indexToRemove}`
      );
      console.log(response.data.message);

      // Optionally, display a message to reflect the success
      setResponseMessage("Image deleted successfully");
    } catch (error) {
      console.error(
        "Error deleting image:",
        error.response?.data || error.message
      );

      // Optionally, revert the optimistic update if the delete fails
      setExistingImages((prevImages) => [...prevImages, file]);

      setResponseMessage("Failed to delete image.");
    }
  };

  // Handle removing a new image file
  const handleRemoveNewImage = (indexToRemove) => {
    setNewImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  // Handle form submission for updating the product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFormData = new FormData();
    newFormData.append("productId", productId); // Include productId in the request body
    newFormData.append("name", name);
    newFormData.append("price", price);
    newFormData.append("details", details);
    newFormData.append("quantity", quantity);
    newFormData.append("category", category);
    newFormData.append("sellerId", sellerId);

    // Append existing images as URLs
    existingImages.forEach((url) => {
      newFormData.append("existingImages", url); // Assuming your backend handles "existingImages" for URLs
    });

    // Append new images (files uploaded by the user)
    newImages.forEach((image, index) => {
      newFormData.append(
        "images",
        image,
        `${name}-${index + 1}.${image.name.split(".").pop()}` // productName-index.ext
      );
    });

    // Debug: Log the FormData content to verify its structure
    for (let pair of newFormData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/access/seller/editProduct`, // Don't pass the productId in the URL
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "user-id": userId, // Pass userId in the headers
          },
        }
      );
      console.log("Product updated successfully", response.data);
      setResponseMessage("Product updated successfully."); // Store response message
    } catch (error) {
      console.error(
        "Error updating product",
        error.response?.data || error.message
      );
      setResponseMessage("Failed to update product.");
    }
  };

  return (
    <div>
      <h2>Edit Product</h2>

      {/* Product Name Input */}
      <div>
        <label>Product Name (to search): </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
        />

        {/* If the user is not a Seller, allow them to input a Seller Name */}
        {userType !== "Seller" && (
          <div>
            <label>Seller Username (to search): </label>
            <input
              type="text"
              value={sellerName}
              onChange={(e) => setSellerName(e.target.value)}
              placeholder="Enter seller username"
            />
          </div>
        )}

        <button type="button" onClick={fetchProduct}>
          Fetch Product
        </button>
      </div>

      {/* Display fetched product details after fetching */}
      {productId && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Price: </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>

          <div>
            <label>Details: </label>
            <input
              type="text"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter product details"
            />
          </div>

          <div>
            <label>Quantity: </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>

          <div>
            <label>Category: </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter product category"
            />
          </div>

          {/* Display existing images */}
          <div>
            <h4>Existing Product Images</h4>
            {existingImages.length > 0 ? (
              existingImages.map((url, index) => {
                var indexOfUploads = url.indexOf("uploads/");
                var relativePath = url.substring(indexOfUploads);

                console.log("File:", relativePath);
                return (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <img
                      src={`http://localhost:8000/${relativePath}`}
                      alt={`Product image ${index + 1}`}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        minWidth: "200px",
                        minHeight: "200px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveExistingImage(relativePath, index)
                      }
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            ) : (
              <p>No images available for this product.</p>
            )}
          </div>

          {/* Upload new images */}
          <div>
            <label>Upload New Images:</label>
            <input
              type="file"
              name="images"
              onChange={handleNewImageChange}
              multiple // Allow multiple file uploads
              accept="image/*" // Only accept image files
            />
          </div>
          {/* Display new image files with a remove button */}
          {newImages.length > 0 && (
            <div>
              <h4>New Selected Images</h4>
              <ul>
                {newImages.map((image, index) => (
                  <li key={index}>
                    {image.name}{" "}
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button type="submit">Update Product</button>
        </form>
      )}

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default EditProductForm;
