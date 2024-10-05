import React, { useState } from "react";
import axios from "axios";

const SortByRating = () => {
  const [sortBy, setSortBy] = useState("asc"); // Default sort order is ascending
  const [products, setProducts] = useState([]); // State to store the sorted products
  const [responseMessage, setResponseMessage] = useState(""); // State to store any response messages

  // Function to toggle sort order between "asc" and "desc"
  const toggleSortOrder = () => {
    setSortBy((prevSortBy) => (prevSortBy === "asc" ? "desc" : "asc"));
  };

  // Function to fetch and sort products based on the current sort order
  const handleSort = async () => {
    try {
      // Make the API request to sort products by rating
      const response = await axios.get(
        "http://localhost:8000/access/seller/sortByRating",
        {
          params: { sortBy },
        } // Sending the current sort order
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

  const localSort = () => {
    const sortedProducts = [...products].sort((a, b) => {
      if (sortBy === "asc") {
        return a.rating - b.rating; // Ascending sort by rating
      } else {
        return b.rating - a.rating; // Descending sort by rating
      }
    });
    setProducts(sortedProducts);
  };

  // Call handleSort or localSort depending on whether we already have products
  React.useEffect(() => {
    if (products.length > 0) {
      // Sort locally if products are already present
      localSort();
    } else {
      // Fetch products from API if products array is empty
      handleSort();
    }
  }, [sortBy]); // Effect will run whenever sortBy changes

  return (
    <div>
      <h2>Sort Products by Rating</h2>

      {/* Button to toggle sort order */}
      <button onClick={toggleSortOrder}>
        Sort by Rating: {sortBy === "asc" ? "Ascending" : "Descending"}
      </button>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display sorted products */}
      {products.length > 0 && (
        <div>
          <h3>Sorted Products:</h3>
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                <h2>
                  <strong>Product Name:</strong> {product.name}
                </h2>
                <p>
                  <strong>Rating:</strong> {product.rating}
                </p>
                <p>
                  <strong>Price:</strong> {product.price}
                </p>
                {product.imageUrl.map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={product.name}
                    style={{ maxWidth: "40px", marginRight: "10px" }}
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

export default SortByRating;
