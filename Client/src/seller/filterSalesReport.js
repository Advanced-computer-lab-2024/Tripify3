import React, { useState } from "react";
import axios from "axios";

const FilterSalesReport = () => {
  const [productId, setProductId] = useState(""); // State for product ID
  const [dateType, setDateType] = useState(""); // State for choosing between date, month, year
  const [date, setDate] = useState(""); // State for exact date
  const [month, setMonth] = useState(""); // State for month
  const [year, setYear] = useState(""); // State for year
  const [greaterThan, setGreaterThan] = useState(""); // State for greater than date
  const [greaterThanOrEqual, setGreaterThanOrEqual] = useState(""); // State for greater than or equal to date
  const [lessThan, setLessThan] = useState(""); // State for less than date
  const [lessThanOrEqual, setLessThanOrEqual] = useState(""); // State for less than or equal to date
  const [greaterThanMonth, setGreaterThanMonth] = useState(""); // State for greater than month
  const [greaterThanMonthOrEqual, setGreaterThanMonthOrEqual] = useState(""); // State for greater than or equal month
  const [lessThanMonth, setLessThanMonth] = useState(""); // State for less than month
  const [lessThanMonthOrEqual, setLessThanMonthOrEqual] = useState(""); // State for less than or equal month
  const [exactMonth, setExactMonth] = useState(""); // State for exact month
  const [filteredSales, setFilteredSales] = useState([]); // State to store the filtered sales
  const [responseMessage, setResponseMessage] = useState(""); // State to store response messages

  const handleFilter = async (e) => {
    e.preventDefault(); // Prevent form default submission

    // Log the productId to ensure it's populated
    console.log("ProductId:", productId);

    // Build request body based on filters
    const requestBody = {
      productId,
      date,
      month: month ? parseInt(month) : undefined,
      year: year ? parseInt(year) : undefined,
      greaterThan,
      greaterThanOrEqual,
      lessThan,
      lessThanOrEqual,
      greaterThanMonth,
      greaterThanMonthOrEqual,
      lessThanMonth,
      lessThanMonthOrEqual,
      exactMonth,
    };

    // Create query string from requestBody
    const queryParams = new URLSearchParams(requestBody);

    try {
      console.log("Query Params:", queryParams.toString());

      // Send GET request with query parameters
      const response = await axios.get(
        `http://localhost:8000/access/seller/filterSalesReport?${queryParams.toString()}`
      );

      setFilteredSales(response.data.filteredSales); // Store the filtered sales
      setResponseMessage(""); // Clear any previous response messages
    } catch (error) {
      console.error("Error fetching sales report:", error);
      setResponseMessage(
        error.response?.data?.message || "Failed to fetch sales report."
      );
    }
  };

  return (
    <div>
      <h2>Filter Sales Report</h2>

      <form onSubmit={handleFilter}>
        {/* Product ID */}
        <div>
          <label>Product ID: </label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
            required
          />
        </div>

        {/* Select Date Type */}
        <div>
          <label>Filter By: </label>
          <select
            value={dateType}
            onChange={(e) => setDateType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="date">Date</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        {/* Date filtering options */}
        {dateType === "date" && (
          <>
            <div>
              <label>Date (Exact): </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Enter exact date"
              />
            </div>

            {/* Greater than date */}
            <div>
              <label>Greater than Date: </label>
              <input
                type="date"
                value={greaterThan}
                onChange={(e) => setGreaterThan(e.target.value)}
                placeholder="Enter date"
              />
            </div>

            {/* Greater than or equal date */}
            <div>
              <label>Greater than or Equal Date: </label>
              <input
                type="date"
                value={greaterThanOrEqual}
                onChange={(e) => setGreaterThanOrEqual(e.target.value)}
                placeholder="Enter date"
              />
            </div>

            {/* Less than date */}
            <div>
              <label>Less than Date: </label>
              <input
                type="date"
                value={lessThan}
                onChange={(e) => setLessThan(e.target.value)}
                placeholder="Enter date"
              />
            </div>

            {/* Less than or equal date */}
            <div>
              <label>Less than or Equal Date: </label>
              <input
                type="date"
                value={lessThanOrEqual}
                onChange={(e) => setLessThanOrEqual(e.target.value)}
                placeholder="Enter date"
              />
            </div>
          </>
        )}

        {/* Month filtering options */}
        {dateType === "month" && (
          <>
            <div>
              <label>Month: </label>
              <input
                type="number"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="Enter month (1-12)"
                min="1"
                max="12"
              />
            </div>

            {/* Exact Month */}
            <div>
              <label>Exact Month: </label>
              <input
                type="number"
                value={exactMonth}
                onChange={(e) => setExactMonth(e.target.value)}
                placeholder="Enter exact month"
              />
            </div>

            {/* Greater than Month */}
            <div>
              <label>Greater than Month: </label>
              <input
                type="number"
                value={greaterThanMonth}
                onChange={(e) => setGreaterThanMonth(e.target.value)}
                placeholder="Enter greater than month"
                min="1"
                max="12"
              />
            </div>

            {/* Greater than or Equal to Month */}
            <div>
              <label>Greater than or Equal to Month: </label>
              <input
                type="number"
                value={greaterThanMonthOrEqual}
                onChange={(e) => setGreaterThanMonthOrEqual(e.target.value)}
                placeholder="Enter greater than or equal to month"
                min="1"
                max="12"
              />
            </div>

            {/* Less than Month */}
            <div>
              <label>Less than Month: </label>
              <input
                type="number"
                value={lessThanMonth}
                onChange={(e) => setLessThanMonth(e.target.value)}
                placeholder="Enter less than month"
                min="1"
                max="12"
              />
            </div>

            {/* Less than or Equal to Month */}
            <div>
              <label>Less than or Equal to Month: </label>
              <input
                type="number"
                value={lessThanMonthOrEqual}
                onChange={(e) => setLessThanMonthOrEqual(e.target.value)}
                placeholder="Enter less than or equal to month"
                min="1"
                max="12"
              />
            </div>
          </>
        )}

        {/* Year filtering options */}
        {dateType === "year" && (
          <div>
            <label>Year: </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Enter year"
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>
        )}

        <button type="submit">Filter Sales</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display filtered sales */}
      {filteredSales.length > 0 && (
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
              {filteredSales.map((sale, index) => (
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
