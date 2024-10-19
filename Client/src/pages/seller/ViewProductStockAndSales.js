import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserId, getUserType } from "../../utils/authUtils.js";
const ViewProductStockAndSales = () => {
  const userId = getUserId(); // Get the user ID from local storage
  const userType = getUserType(); // Get the user type from local storage
  const [products, setProducts] = useState([]); // State to store products
  const [loading, setLoading] = useState(true); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  // Fetch the products when the component is mounted
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Make API call to retrieve product stock and sales data
        const response = await axios.get(
          "http://localhost:8000/access/seller/viewProductStockAndSales"
        );
        if (userType === "Admin") {
          setProducts(response.data);
        } else {
          setProducts(
            response.data.filter((product) => product.sellerId === userId)
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorMessage(
          error.response?.data?.message || "Failed to load products."
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div>
      <h2>Product Stock and Sales</h2>

      {/* Display loading message */}
      {loading && <p>Loading products...</p>}

      {/* Display error message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Display products if available */}
      {!loading && products.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Sales</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.sales}</td>
                <td>{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Display no products message */}
      {!loading && products.length === 0 && <p>No products found.</p>}
    </div>
  );
};

export default ViewProductStockAndSales;
