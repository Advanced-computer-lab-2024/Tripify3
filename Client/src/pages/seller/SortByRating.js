import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserId, getUserType } from "../../utils/authUtils.js";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const SortByRating = () => {
  const userId = getUserId(); // Get the user ID from local storage
  const userType = getUserType(); // Get the user type from local storage
  const [sortBy, setSortBy] = useState("asc"); // Default sort order is ascending
  const [products, setProducts] = useState([]); // State to store the sorted products
  const [sellerNames, setSellerNames] = useState({}); // State to store seller names
  const [responseMessage, setResponseMessage] = useState(""); // State to store any response messages

  // Function to toggle sort order between "asc" and "desc"
  const toggleSortOrder = () => {
    setSortBy((prevSortBy) => (prevSortBy === "asc" ? "desc" : "asc"));
  };

  // Function to fetch the seller names
  const fetchSellerNames = async (products) => {
    try {
      const sellerIds = [
        ...new Set(products.map((product) => product.sellerId)),
      ]; // Get unique seller IDs
      const sellerPromises = sellerIds.map((sellerId) =>
        axios.get(
          `http://localhost:8000/access/seller/findSeller?id=${sellerId}`
        )
      );
      const sellerResponses = await Promise.all(sellerPromises);
      const sellerData = sellerResponses.reduce((acc, response) => {
        const { _id, name } = response.data;
        acc[_id] = name; // Map sellerId to seller name
        return acc;
      }, {});
      setSellerNames(sellerData); // Store seller names
    } catch (error) {
      console.error("Error fetching seller names:", error);
    }
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
      if (userType === "Seller") {
        const filteredProducts = response.data.filter(
          (product) => product.sellerId === userId
        );
        setProducts(filteredProducts);
      } else {
        setProducts(response.data);
      }

      // Fetch seller names based on the products
      await fetchSellerNames(response.data);
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
  useEffect(() => {
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

                {/* Display seller name with a link to seller's page */}
                {userType != "Seller" ? (
                  <p>
                    <strong>Seller Name:</strong>{" "}
                    {sellerNames[product.sellerId] ? (
                      <Link to={`/seller/${product.sellerId}`}>
                        {sellerNames[product.sellerId]}
                      </Link>
                    ) : (
                      "Loading seller name..."
                    )}
                  </p>
                ) : (
                  <></>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortByRating;
