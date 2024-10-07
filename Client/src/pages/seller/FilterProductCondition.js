import React, { useState } from "react";
import axios from "axios";
import { getUserType, getUserId } from "../../utils/authUtils.js";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const FilterProductCondition = () => {
  const userId = getUserId(); // Get the user ID from local storage
  const userType = getUserType(); // Get the user type from local storage
  const [conditions, setConditions] = useState([
    { operator: ">=", value: "" }, // Default condition
  ]); // To hold multiple conditions
  const [products, setProducts] = useState([]); // State to store the filtered products
  const [sellerNames, setSellerNames] = useState({}); // State to store seller names
  const [responseMessage, setResponseMessage] = useState(""); // State to store the response message

  // Handle adding new condition
  const addCondition = () => {
    setConditions([...conditions, { operator: ">=", value: "" }]);
  };

  // Handle removing a condition
  const removeCondition = (index) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  // Handle updating operator or value
  const updateCondition = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index][field] = value;
    setConditions(newConditions);
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
      console.error("Error fetching seller names:", error);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    // Build the priceCondition string based on the selected conditions
    const priceCondition = conditions
      .map((condition) => `price${condition.operator}${condition.value}`)
      .join(" and "); // Join conditions with "and"

    try {
      // Send a GET request with the priceCondition in the body
      const response = await axios.get(
        "http://localhost:8000/access/seller/filterProductCondition",
        {
          params: { priceCondition }, // Send the priceCondition as a query parameter
        }
      );

      // If successful, store the products in the state
      if (userType === "Seller") {
        const filteredProducts = response.data.filter(
          (product) => product.sellerId === userId
        );
        setProducts(filteredProducts);
      } else {
        setProducts(response.data);
      }

      // Fetch the seller names based on the filtered products
      await fetchSellerNames(response.data);
      setResponseMessage("");
    } catch (error) {
      // Handle any errors and display appropriate message
      console.error("Error:", error);
      setResponseMessage(
        error.response?.data?.message || "Failed to filter products."
      );
      setProducts([]); // Clear products if there's an error
    }
  };

  return (
    <div>
      <h2>Filter Products by Price Condition</h2>

      <form onSubmit={handleFilter}>
        {conditions.map((condition, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            {/* Dropdown for selecting the operator */}
            <select
              value={condition.operator}
              onChange={(e) =>
                updateCondition(index, "operator", e.target.value)
              }
              required
            >
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value=">=">&gt;=</option>
              <option value="<=">&lt;=</option>
              <option value="==">==</option>
              <option value="!=">!=</option>
            </select>

            {/* Input for the price value */}
            <input
              type="number"
              value={condition.value}
              onChange={(e) => updateCondition(index, "value", e.target.value)}
              placeholder="Enter price"
              required
            />

            {/* Button to remove condition */}
            {index > 0 && (
              <button type="button" onClick={() => removeCondition(index)}>
                Remove
              </button>
            )}
          </div>
        ))}

        {/* Button to add another condition */}
        <button type="button" onClick={addCondition}>
          Add Condition
        </button>

        <button type="submit">Filter Products</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display filtered products */}
      {products.length > 0 && (
        <div>
          <h3>Filtered Products:</h3>
          <ul>
            {products.map((product) => (
              <li key={product._id}>
                <h2>
                  <strong>Product Name:</strong> {product.name}
                </h2>
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
                    key={index}
                    src={image}
                    alt={product.name}
                    style={{ maxWidth: "50px" }}
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

export default FilterProductCondition;
