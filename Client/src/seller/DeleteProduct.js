import React, { useState } from "react";
import axios from "axios";

const DeleteProduct = () => {
  const [name, setName] = useState(""); // Input for product name
  const [responseMessage, setResponseMessage] = useState(""); // To store response messages

  const handleDelete = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    try {
      // Make the API request to delete the product using axios
      const response = await axios.delete(
        `http://localhost:8000/access/seller/deleteProduct`,
        {
          params: { name }, // Send the name as a query parameter
        }
      );

      // If the request is successful, update the response message
      setResponseMessage(response.data.message);
    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
      setResponseMessage(
        error.response?.data?.message || "Failed to delete the product."
      );
    }
  };

  return (
    <div>
      <h2>Delete a Product</h2>

      <form onSubmit={handleDelete}>
        <div>
          <label>Product Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name to delete"
            required
          />
        </div>

        <button type="submit">Delete Product</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default DeleteProduct;
