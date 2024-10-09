import React, { useState } from "react";
import axios from "axios";

const DecrementProductQuantity = () => {
  const [productId, setProductId] = useState(""); // State for product ID
  const [quantity, setQuantity] = useState(0); // State for quantity to decrement
  const [responseMessage, setResponseMessage] = useState(""); // State for response message

  const handleDecrement = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "http://localhost:8000/access/seller/decrementProductQuantity",
        { productId, quantity }
      );
      setResponseMessage("Product quantity updated successfully.");
      console.log(response.data); // Updated product
    } catch (error) {
      console.error("Error decrementing product quantity:", error);
      setResponseMessage(
        error.response?.data?.message || "Failed to update product quantity."
      );
    }
  };

  return (
    <div>
      <h2>Decrement Product Quantity</h2>

      <form onSubmit={handleDecrement}>
        <div>
          <label>Product ID: </label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
            required
          />
        </div>

        <div>
          <label>Quantity to Decrement: </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            placeholder="Enter quantity"
            required
          />
        </div>

        <button type="submit">Decrement Quantity</button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default DecrementProductQuantity;
