import React, { useState } from "react";
import axios from "axios";

const EditProductForm = () => {
  const [name, setName] = useState(""); // Product name (to search)
  const [price, setPrice] = useState("");
  const [details, setDetails] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rating, setRating] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make the API request to edit the product
      const response = await axios.put(
        "http://localhost:8000/access/seller/editProduct",
        {
          name,
          price,
          details,
          quantity,
          rating,
          imageUrl,
          category,
          sellerId,
        }
      );
      // Set response message on success
      setResponseMessage("Product updated successfully.");
      console.log("Response:", response.data);
    } catch (error) {
      // Handle any errors
      console.error("Error:", error.response.data); // Log the backend error message
      setResponseMessage("Failed to update product.");
    }
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name (to search): </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        <div>
          <label>Price: </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            required
          />
        </div>

        <div>
          <label>Details: </label>
          <input
            type="text"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Enter product details"
            required
          />
        </div>

        <div>
          <label>Quantity: </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            required
          />
        </div>

        <div>
          <label>Rating: </label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Enter rating"
          />
        </div>

        <div>
          <label>Image URL: </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
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

        <div>
          <label>Seller ID (optional): </label>
          <input
            type="text"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            placeholder="Enter seller ID"
          />
        </div>

        <button type="submit">Update Product</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default EditProductForm;
