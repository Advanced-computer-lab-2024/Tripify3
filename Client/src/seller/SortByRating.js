import React, { useState } from "react";
import axios from "axios";

const SortByRating = () => {
  const [sortBy, setSortBy] = useState("asc"); // Default sort order is ascending
  const [products, setProducts] = useState([]); // State to store the sorted products
  const [responseMessage, setResponseMessage] = useState(""); // State to store any response messages

  const handleSort = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    try {
      // Make the API request to sort products by rating
      console.log(sortBy);
      const response = await axios.get(
        "http://localhost:8000/access/seller/sortByRating",
        {
          params: { sortBy },
        } // Sending the selected sort order
      );

      // Store the sorted products in the state
      setProducts(response.data);
      setResponseMessage("");
    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
      setResponseMessage(
        error.response?.data?.message || "Failed to sort products."
      );
      setProducts([]); // Clear products if there's an error
    }
  };

  return (
    <div>
      <h2>Sort Products by Rating</h2>

      {/* Sort order selection form */}
      <form onSubmit={handleSort}>
        <div>
          <label>Sort by: </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            required
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <button type="submit">Sort Products</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display sorted products */}
      {products.length > 0 && (
        <div>
          <h3>Sorted Products:</h3>
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                <p>
                  <strong>Product Name:</strong> {product.name}
                </p>
                <p>
                  <strong>Rating:</strong> {product.rating}
                </p>
                <p>
                  <strong>Price:</strong> {product.price}
                </p>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ maxWidth: "40px" }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortByRating;
