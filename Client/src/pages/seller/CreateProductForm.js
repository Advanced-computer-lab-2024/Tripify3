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
    rating: 0,
    imageUrl: [], // Now this is an array
    category: "",
    sellerId: userType === "Seller" ? userId : "", // Default to logged-in user for Seller
    type: userType,
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [createdProduct, setCreatedProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageAdd = () => {
    setFormData({
      ...formData,
      imageUrl: [...formData.imageUrl, ""], // Add empty field for a new image
    });
  };

  const handleImageUrlChange = (e, index) => {
    const newImageUrls = formData.imageUrl.slice();
    newImageUrls[index] = e.target.value;
    setFormData({ ...formData, imageUrl: newImageUrls });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // For Admin, ensure sellerId is included in formData
    if (userType === "Admin" && sellerId) {
      formData.sellerId = sellerId;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/access/seller/createProduct", // Replace with your API endpoint
        formData
      );
      setCreatedProduct(response.data.product); // Store the created product data
      setErrorMessage(""); // Success message
    } catch (error) {
      setResponseMessage("Error: " + error.response.data.message);
      setCreatedProduct(null);
    }
  };

  return (
    <div>
      <h2>Create New Product</h2>
      <form onSubmit={handleSubmit}>
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
        {userType === "Admin" ? (
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
        ) : (
          <></>
        )}

        {/* Image URL inputs */}
        {formData.imageUrl.map((url, index) => (
          <div key={index}>
            <label>Image URL {index + 1}:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => handleImageUrlChange(e, index)}
              placeholder="Enter image URL"
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleImageAdd}>
          Add Image
        </button>

        <button type="submit">Create Product</button>
      </form>

      {/* Show error message if there's an error */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Show created product details if product is created */}
      {createdProduct ? (
        <div>
          <h3>Product Created Successfully</h3>
          <p>Name: {createdProduct.name}</p>
          <p>Price: {createdProduct.price}</p>
          <p>Details: {createdProduct.details}</p>
          <p>Quantity: {createdProduct.quantity}</p>
          <p>Rating: {createdProduct.rating}</p>
          {/* Display product images */}
          {createdProduct.imageUrl.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Product image ${index + 1}`}
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
          ))}
          <p>Category: {createdProduct.category}</p>
          <p>Seller ID: {createdProduct.sellerId}</p>
          <p>Sales: {createdProduct.sales}</p>
        </div>
      ) : (
        <p>{responseMessage}</p>
      )}
    </div>
  );
};

export default CreateProductForm;
