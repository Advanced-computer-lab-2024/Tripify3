import React, { useState } from "react";
import axios from "axios";
import { getUserType, getUserId } from "../../utils/authUtils.js";

const SearchProduct = () => {
  const userType = getUserType(); // Get the user type from local storage
  const userId = getUserId(); // Get the user ID from local storage
  const [name, setName] = useState(""); // Input for product name
  const [productResults, setProductResults] = useState([]); // To store product search results
  const [responseMessage, setResponseMessage] = useState(""); // To store any response messages

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    try {
      console.log("Searching for product:", name);
      const response = await axios.get(
        `http://localhost:8000/access/seller/searchProduct?name=${name}&sellerId=${userId}`
      );

      // Set the search results
      if (userType === "Seller") {
        const filteredProducts = response.data.filter(
          (product) => product.sellerId === userId // Explicitly return the comparison result
        );

        console.log("Filtered Products:", filteredProducts); // Log filtered products

        if (filteredProducts.length === 0) {
          setResponseMessage("No products found for the seller.");
        } else {
          setResponseMessage(""); // Clear message if there are products
        }

        setProductResults(filteredProducts);
      } else {
        setProductResults(response.data);
        setResponseMessage(""); // Clear message for non-seller
      }
    } catch (error) {
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
                <p>
                  <strong>Category:</strong> {product.category}
                </p>
                {product.imageUrl.map((image, index) => (
                  <img
                    key={index} // Ensure key is unique
                    src={image}
                    alt={product.name + index}
                    style={{ maxWidth: "100px" }}
                  />
                ))}
                {userType !== "Seller" ? (
                  <p>
                    <strong>Seller:</strong>
                    <a href={`/seller/${product.sellerId}`}>
                      View Seller Profile
                    </a>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchProduct;
