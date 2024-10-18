import React, { useState } from "react";
import axios from "axios";
import { getUserId, getUserType } from "../../utils/authUtils";
const FilterSalesReport = () => {
  const [productId, setProductId] = useState(""); // Product ID
  const [conditions, setConditions] = useState([]); // Multiple conditions
  const [responseMessage, setResponseMessage] = useState(""); // For response messages
  const [filteredSales, setFilteredSales] = useState([]); // Sales data from API
  const [filteredResults, setFilteredResults] = useState([]); // Filtered sales data for display
  const [Id, setId] = useState("");
  // Handle adding a new condition
  const addCondition = () => {
    setConditions([...conditions, { type: "", operator: "=", value: "" }]); // Default operator is "="
  };

  // Handle removing a condition
  const removeCondition = (indexToRemove) => {
    setConditions(conditions.filter((_, index) => index !== indexToRemove));
  };

  // Handle updating a condition's type (date, month, year)
  const handleConditionTypeChange = (index, newType) => {
    const updatedConditions = conditions.map((condition, i) =>
      i === index ? { ...condition, type: newType, value: "" } : condition
    );
    setConditions(updatedConditions);
  };

  // Handle updating a condition's operator (e.g., >, <, =)
  const handleOperatorChange = (index, newOperator) => {
    const updatedConditions = conditions.map((condition, i) =>
      i === index ? { ...condition, operator: newOperator } : condition
    );
    setConditions(updatedConditions);
  };

  // Handle changing the value for a specific condition
  const handleConditionValueChange = (index, newValue) => {
    const updatedConditions = conditions.map((condition, i) =>
      i === index ? { ...condition, value: newValue } : condition
    );
    setConditions(updatedConditions);
  };

  // Fetch the sales data for the product
  const fetchSalesHistory = async () => {
    var sellerD = getUserId == "Admin" ? Id : getUserId();
    console.log("get user ", getUserType());
    try {
      const response = await axios.get(
        `http://localhost:8000/access/seller/getSalesHistory?name=${productId}&&sellerId=${sellerD}`
      );
      setFilteredSales(response.data || []); // Ensure it's an array
      console.log(response.data);
      setResponseMessage("");
    } catch (error) {
      console.error("Error fetching sales report:", error);
      setResponseMessage(
        error.response?.data?.message || "Failed to fetch sales report."
      );
    }
  };

  // Function to apply the conditions and filter the data
  const handleFilter = (e) => {
    e.preventDefault();

    let filteredData = filteredSales || []; // Ensure it's an array

    conditions.forEach((condition) => {
      if (condition.type === "date") {
        filteredData = filteredData.filter((sale) => {
          const saleDate = new Date(sale.date);
          const conditionDate = new Date(condition.value);

          switch (condition.operator) {
            case "=":
              return saleDate.toDateString() === conditionDate.toDateString();
            case ">":
              return saleDate > conditionDate;
            case ">=":
              return saleDate >= conditionDate;
            case "<":
              return saleDate < conditionDate;
            case "<=":
              return saleDate <= conditionDate;
            case "!=":
              return saleDate.toDateString() !== conditionDate.toDateString();
            default:
              return true;
          }
        });
      } else if (condition.type === "month") {
        filteredData = filteredData.filter((sale) => {
          const saleMonth = new Date(sale.date).getMonth() + 1;
          const conditionMonth = parseInt(condition.value, 10);

          switch (condition.operator) {
            case "=":
              return saleMonth === conditionMonth;
            case ">":
              return saleMonth > conditionMonth;
            case ">=":
              return saleMonth >= conditionMonth;
            case "<":
              return saleMonth < conditionMonth;
            case "<=":
              return saleMonth <= conditionMonth;
            case "!=":
              return saleMonth !== conditionMonth;
            default:
              return true;
          }
        });
      } else if (condition.type === "year") {
        filteredData = filteredData.filter((sale) => {
          const saleYear = new Date(sale.date).getFullYear();
          const conditionYear = parseInt(condition.value, 10);

          switch (condition.operator) {
            case "=":
              return saleYear === conditionYear;
            case ">":
              return saleYear > conditionYear;
            case ">=":
              return saleYear >= conditionYear;
            case "<":
              return saleYear < conditionYear;
            case "<=":
              return saleYear <= conditionYear;
            case "!=":
              return saleYear !== conditionYear;
            default:
              return true;
          }
        });
      }
    });

    setFilteredResults(filteredData); // Update the filtered results
  };

  return (
    <div>
      <h2>Filter Sales Report</h2>

      <div>
        {/* Product ID */}
        <label>Product ID: </label>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Enter product ID"
          required
        />
        {getUserType() == "Admin" ? (
          <>
            <label htmlFor="sellerId">Seller ID:</label>
            <input
              type="text"
              id="sellerId"
              value={Id}
              onChange={(e) => setId(e.target.value)} // Update state as the admin types
              placeholder="Enter seller ID"
              required
            />
          </>
        ) : (
          <></>
        )}
        <button onClick={() => fetchSalesHistory()}>Search Product</button>
      </div>

      {/* Render each condition */}
      {filteredSales && filteredSales.length > 0 ? (
        <form onSubmit={handleFilter}>
          {conditions.map((condition, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <label>Filter Type: </label>
              <select
                value={condition.type}
                onChange={(e) =>
                  handleConditionTypeChange(index, e.target.value)
                }
              >
                <option value="">Select Type</option>
                <option value="date">Date</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>

              {/* Operator selection for comparison */}
              <label>Operator: </label>
              <select
                value={condition.operator}
                onChange={(e) => handleOperatorChange(index, e.target.value)}
              >
                <option value="=">=</option>
                <option value=">">{">"}</option>
                <option value="<">{"<"}</option>
                <option value=">=">{">="}</option>
                <option value="<=">{"<="}</option>
                <option value="!=">!=</option>
              </select>

              {condition.type === "date" && (
                <input
                  type="date"
                  value={condition.value}
                  onChange={(e) =>
                    handleConditionValueChange(index, e.target.value)
                  }
                  placeholder="Enter date"
                />
              )}

              {condition.type === "month" && (
                <input
                  type="number"
                  value={condition.value}
                  onChange={(e) =>
                    handleConditionValueChange(index, e.target.value)
                  }
                  placeholder="Enter month (1-12)"
                  min="1"
                  max="12"
                />
              )}

              {condition.type === "year" && (
                <input
                  type="number"
                  value={condition.value}
                  onChange={(e) =>
                    handleConditionValueChange(index, e.target.value)
                  }
                  placeholder="Enter year"
                  min="2000"
                  max={new Date().getFullYear()}
                />
              )}

              <button
                type="button"
                onClick={() => removeCondition(index)}
                style={{ marginLeft: "10px" }}
              >
                Remove Condition
              </button>
            </div>
          ))}

          {/* Button to add new condition */}
          <button type="button" onClick={addCondition}>
            Add Condition
          </button>

          <button type="submit" style={{ marginLeft: "10px" }}>
            Filter Sales
          </button>
        </form>
      ) : (
        <p>No sales data available</p>
      )}

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display filtered sales */}
      {filteredResults.length > 0 && (
        <div>
          <h3>Filtered Sales Report</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((sale, index) => (
                <tr key={index}>
                  <td>{new Date(sale.date).toLocaleDateString()}</td>
                  <td>{sale.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FilterSalesReport;
