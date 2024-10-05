import React, { useState } from "react";
import axios from "axios";

const SearchProduct = () => {
  const [name, setName] = useState(""); // Input for product name
  const [productResults, setProductResults] = useState([]); // To store product search results
  const [responseMessage, setResponseMessage] = useState(""); // To store any response messages

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    try {
      // Make the API request to search for a product
      console.log("Searching for product:", name);
      const response = await axios.get(
        `http://localhost:8000/access/seller/searchProduct?name=${name}`
      );

      // Set the search results
      setProductResults(response.data);
      setResponseMessage("");
    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
      setResponseMessage(
        error.response?.data?.message || "Failed to search product."
      );
      setProductResults([]); // Clear product results if an error occurs
    }
  };

  return (
    <div>
      <h2>Search for a Product</h2>

      <form onSubmit={handleSearch}>
        <div>
          <label>Product Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        <button type="submit">Search</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display product search results */}
      {productResults.length > 0 && (
        <div>
          <h3>Search Results:</h3>
          <ul>
            {productResults.map((product) => (
              <li key={product._id}>
                <p>
                  <strong>Product Name:</strong> {product.name}
                </p>
                <p>
                  <strong>Price:</strong> {product.price}
                </p>
                <p>
                  <strong>Details:</strong> {product.details}
                </p>
                <p>
                  <strong>Rating:</strong> {product.rating}
                </p>
                <p>
                  <strong>Quantity:</strong> {product.quantity}
                </p>
                {product.imageUrl.map((image, index) => (
                  <img
                    src={image}
                    alt={product.name + index}
                    style={{ maxWidth: "100px" }}
                  />
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
