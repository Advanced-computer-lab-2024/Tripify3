import React, { useState } from "react";
import axios from "axios";

const AddProdImage = () => {
  const [id, setId] = useState(""); // State for the product ID
  const [imageUrl, setImageUrl] = useState(""); // State for the image URL
  const [responseMessage, setResponseMessage] = useState(""); // State to store response messages
  const [updatedProduct, setUpdatedProduct] = useState(null); // State to store the updated product

  const handleAddImage = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      // Make the API request to add the product image
      console.log(id, imageUrl);
      const response = await axios.put(
        "http://localhost:8000/access/seller/addProdImage",
        {
          id,
          imageUrl,
        }
      );

      // Set the response message and the updated product
      setResponseMessage(response.data.message);
      setUpdatedProduct(response.data.product);
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage(
        error.response?.data?.message || "Failed to add image."
      );
      setUpdatedProduct(null); // Clear the product if there’s an error
    }
  };

  return (
    <div>
      <h2>Add Product Image</h2>

      <form onSubmit={handleAddImage}>
        {/* Input for product ID */}
        <div>
          <label>Product ID: </label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter product ID"
            required
          />
        </div>

        {/* Input for image URL */}
        <div>
          <label>Image URL: </label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            required
          />
        </div>

        <button type="submit">Add Image</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display updated product */}
      {updatedProduct && (
        <div>
          <h3>Updated Product:</h3>
          <p>
            <strong>Product Name:</strong> {updatedProduct.name}
          </p>
          <p>
            <strong>Price:</strong> {updatedProduct.price}
          </p>
          <img
            src={updatedProduct.imageUrl}
            alt={updatedProduct.name}
            style={{ maxWidth: "200px" }}
          />
        </div>
      )}
    </div>
  );
};

export default AddProdImage;
