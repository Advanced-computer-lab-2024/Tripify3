import React, { useState } from "react";
import axios from "axios";

const CreateProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    details: "",
    quantity: 0,
    rating: 0,
    imageUrl: "",
    category: "",
    sellerId: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [createdProduct, setCreatedProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          <label>Rating:</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="5"
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
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
        <div>
          <label>Seller ID:</label>
          <input
            type="text"
            name="sellerId"
            value={formData.sellerId}
            onChange={handleChange}
            required
          />
        </div>
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
          <img
            src={createdProduct.imageUrl}
            alt="Product"
            style={{ maxWidth: "100px", maxHeight: "100px" }} // Set the dimensions as needed
          />
          <p>Category: {createdProduct.category}</p>
          <p>Seller ID: {createdProduct.sellerId}</p>
          <p>Sales: {createdProduct.sales}</p>
        </div>
      )}
    </div>
  );
};

export default CreateProductForm;
