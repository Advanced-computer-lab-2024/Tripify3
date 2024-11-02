import React, { useState } from "react";
import axios from "axios";
import { getUserId, getUserType } from "../../utils/authUtils.js";

const CreateProductForm = () => {
  const userId = getUserId(); // Get the user ID from local storage
  const userType = getUserType(); // Get the user type from local storage
  const [sellerId, setSellerId] = useState(userType === "Seller" ? userId : ""); // Handle sellerId input for Admin

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    details: "",
    quantity: 0,
    category: "",
    sellerId: userType === "Seller" ? userId : "", // Default to logged-in user for Seller
  });

  const [images, setImages] = useState([]); // To store file inputs
  const [responseMessage, setResponseMessage] = useState("");
  const [createdProduct, setCreatedProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle adding files
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files); // Convert FileList to an array
    setImages((prevImages) => [...prevImages, ...newFiles]); // Append new files to the list
  };

  // Handle removing a file from the list
  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFormData = new FormData();
    newFormData.append("name", formData.name);
    newFormData.append("price", formData.price);
    newFormData.append("details", formData.details);
    newFormData.append("quantity", formData.quantity);
    newFormData.append("category", formData.category);

    // Add the images with the product name and sellerId
    images.forEach((image, index) => {
      newFormData.append(
        "images",
        image,
        `${formData.name}-${index + 1}.${image.name.split(".").pop()}` // Use productName-sellerId-index.ext
      );
    });

    try {
      const response = await axios.post(
        `http://localhost:8000/access/seller/createProductM`,
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "user-id": userId, // Pass userId in the headers
          },
        }
      );
      console.log("Product created successfully", response.data);
      setCreatedProduct(response.data.product); // Store the created product data
    } catch (error) {
      console.error("Error creating product", error.response.data);
    }
  };

  return (
    <div>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Details:</label>
          <input
            type="text"
            name="details"
            value={formData.details}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        {/* Only show seller ID input for Admin */}
        {userType === "Admin" && (
          <div>
            <label>Seller ID: </label>
            <input
              type="text"
              value={sellerId}
              onChange={(e) => setSellerId(e.target.value)}
              placeholder="Enter seller ID"
              required
            />
          </div>
        )}

        {/* Image file inputs */}
        <div>
          <label>Upload Images:</label>
          <input
            type="file"
            name="images"
            onChange={handleImageChange}
            multiple // Allow multiple file uploads
            accept="image/*" // Only accept image files
          />
        </div>

        {/* Display selected files with a remove button */}
        {images.length > 0 && (
          <div>
            <h3>Selected Images:</h3>
            <ul>
              {images.map((image, index) => (
                <li key={index}>
                  {image.name}{" "}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit">Create Product</button>
      </form>

      {/* Show error message if there's an error */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Show created product details if product is created */}
      {createdProduct && (
        <div>
          <h3>Product Created Successfully</h3>
          <p>Name: {createdProduct.name}</p>
          <p>Price: {createdProduct.price}</p>
          <p>Details: {createdProduct.details}</p>
          <p>Quantity: {createdProduct.quantity}</p>
          <p>Rating: {createdProduct.rating}</p>
          {/* Display product images */}
          {createdProduct.imageUrl &&
            createdProduct.imageUrl.map((url, index) => {
              var indexOfUploads = url.indexOf("uploads/");
              var relativePath = url.substring(indexOfUploads);
              return (
                <img
                  key={index}
                  src={`http://localhost:8000/${relativePath}`}
                  alt={`Product image ${index + 1}`}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    minWidth: "200px",
                    minHeight: "200px",
                  }}
                />
              );
            })}
          <p>Category: {createdProduct.category}</p>
          <p>Seller ID: {createdProduct.sellerId}</p>
          <p>Sales: {createdProduct.sales}</p>
        </div>
      )}

      <p>{responseMessage}</p>
    </div>
  );
};

export default CreateProductForm;
