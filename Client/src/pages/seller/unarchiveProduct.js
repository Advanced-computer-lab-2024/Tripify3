import React, { useState } from "react";
import axios from "axios";

const ArchiveProduct = () => {
  const [id, setId] = useState(""); // State for product ID input
  const [responseMessage, setResponseMessage] = useState(""); // State to store response messages

  const handleArchive = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      // Make the API request to archive the product
      const response = await axios.put(
        "http://localhost:8000/access/seller/unarchiveProduct",
        { id } // Sending the product id in the request body
      );

      // Set the response message
      setResponseMessage("Product unarchived successfully.");
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage(
        error.response?.data?.message || "Failed to unarchive product."
      );
    }
  };

  return (
    <div>
      <h2>Unarchive Product</h2>

      <form onSubmit={handleArchive}>
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

        <button type="submit">Unarchive Product</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default ArchiveProduct;
