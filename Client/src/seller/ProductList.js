import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/access/seller/searchAllProducts"
      );
      setProducts(response.data);
    } catch (error) {
      setErrorMessage("Error fetching products: " + error.message);
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
              <img
                src={product.imageUrl.split(" ")[0]} // Use the first image URL
                alt={product.name}
                style={{ maxWidth: "200px", maxHeight: "200px" }} // You can adjust the size
              />
              <p>Price: {product.price}</p>
              <p>Details: {product.details}</p>
              <p>Rating: {product.rating}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Category: {product.category}</p>
              <p>Sales: {product.sales}</p>

              {/* Map over salesHistory */}
              {product.salesHistory && product.salesHistory.length > 0 ? (
                <div>
                  <h4>Sales History</h4>
                  <ul>
                    {product.salesHistory.map((sale, index) => (
                      <li key={index}>
                        Quantity Sold: {sale.quantity}, Date:{" "}
                        {new Date(sale.date).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>No sales history available.</p>
              )}

              <p>Seller ID: {product.sellerId}</p>
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
