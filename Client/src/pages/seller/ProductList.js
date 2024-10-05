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

              {/* Map over salesHistory */}
              {/* {product.salesHistory && product.salesHistory.length > 0 ? (
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
              )} */}
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
                <p>No review be the first one to give feedback.</p>
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
