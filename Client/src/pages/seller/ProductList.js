import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sellerNames, setSellerNames] = useState({}); // To store seller names by sellerId

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/access/seller/searchAllProducts"
      );
      setProducts(response.data);
      fetchSellerNames(response.data); // Fetch seller names after getting products
    } catch (error) {
      setErrorMessage("Error fetching products: " + error.message);
    }
  };

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
      setErrorMessage("Error fetching seller names: " + error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <h3>{product.name}</h3>

              {/* Check if imageUrl is an array, and render the first image */}
              {Array.isArray(product.imageUrl) &&
              product.imageUrl.length > 0 ? (
                product.imageUrl.map((url, index) => (
                  <img
                    key={index} // Add a unique key for each image
                    src={url} // Use each image URL in the array
                    alt={product.name}
                    style={{ maxWidth: "50px", maxHeight: "50px" }} // Adjust the size as needed
                  />
                ))
              ) : (
                <p>No images available</p> // Fallback message if no images are found
              )}

              <p>Price: {product.price}</p>
              <p>Details: {product.details}</p>
              <p>Rating: {product.rating}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Category: {product.category}</p>
              <p>Sales: {product.sales}</p>

              {product.reviews && product.reviews.length > 0 ? (
                <div>
                  <h4>Sales History</h4>
                  <ul>
                    {product.reviews.map((review, index) => (
                      <li key={index}>
                        Review ID: {review._id}, Rating: {review.rating},{" "}
                        {review.comment}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No review, be the first one to give feedback.</p>
              )}

              {/* Display seller name as a clickable link */}
              <p>
                Seller:{" "}
                {sellerNames[product.sellerId] ? (
                  <Link to={`/seller/${product.sellerId}`}>
                    {sellerNames[product.sellerId]}
                  </Link>
                ) : (
                  "Loading seller name..."
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductList;
