import React, { useState } from "react";
import axios from "axios";

const FilterProductCondition = () => {
  const [conditions, setConditions] = useState([
    { operator: ">=", value: "" }, // Default condition
  ]); // To hold multiple conditions
  const [products, setProducts] = useState([]); // State to store the filtered products
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

  const handleFilter = async (e) => {
    e.preventDefault(); // Prevent default form behavior

    // Build the priceCondition string based on the selected conditions
    const priceCondition = conditions
      .map((condition) => `price${condition.operator}${condition.value}`)
      .join(" and "); // Join conditions with "and"

    try {
      // Send a POST request with the priceCondition in the body
      const response = await axios.get(
        "http://localhost:8000/access/seller/filterProductCondition",
        {
          params: { priceCondition }, // Send the priceCondition as a query parameter
        }
      );

      // If successful, store the products in the state
      setProducts(response.data);
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

export default FilterProductCondition;
