import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Select from "react-select"; // Dropdown component
import DatePicker from "react-datepicker"; // Date picker component
import "react-datepicker/dist/react-datepicker.css"; // Date picker styles
import { getUserId } from "../../utils/authUtils.js";

const SalesReport = () => {
  const [reportData, setReportData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const userId = getUserId();
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/revenue/${userId}`);
        setReportData(response.data);
        setFilteredData(response.data); // Initially, show all data
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    };

    fetchData();
  }, []);

  if (!reportData) {
    return <div>Loading...</div>;
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Colors for Pie Chart

  // Filter products based on user selections
  const applyFilters = () => {
    let data = reportData.products;

    // Filter by product
    if (selectedProduct) {
      data = data.filter((product) => product.name === selectedProduct.value);
    }

    // Filter by date range
    if (startDate || endDate) {
      data = data.map((product) => ({
        ...product,
        saleDates: product.saleDates.filter((date) => {
          const saleDate = new Date(date);
          return (
            (!startDate || saleDate >= startDate) &&
            (!endDate || saleDate <= endDate)
          );
        }),
        quantitySold: product.saleDates.filter((date) => {
          const saleDate = new Date(date);
          return (
            (!startDate || saleDate >= startDate) &&
            (!endDate || saleDate <= endDate)
          );
        }).length, // Recalculate quantitySold based on filtered saleDates
      })).filter((product) => product.quantitySold > 0); // Exclude products with no sales in the selected range
    }

    // Update filtered data
    setFilteredData({
      ...reportData,
      products: data,
      totalRevenue: data.reduce((sum, product) => sum + product.revenue, 0), // Recalculate total revenue
    });
  };

  // Dropdown options for products
  const productOptions = reportData.products.map((product) => ({
    value: product.name,
    label: product.name,
  }));

  // Data for Bar Chart
  const barData = filteredData.products.map((product) => ({
    name: product.name,
    revenue: product.revenue,
    quantitySold: product.quantitySold,
  }));

  // Data for Pie Chart
  const pieData = filteredData.products.map((product) => ({
    name: product.name,
    value: product.revenue,
  }));

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "24px", color: "#333" }}>
        Sales Report for Seller
      </h2>

      {/* Total Revenue */}
      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "20px", color: "#333" }}>
          Total Revenue: ${filteredData.totalRevenue}
        </h3>
      </div>

      {/* Filters Section */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {/* Product Dropdown */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h4 style={{ fontSize: "18px", marginBottom: "10px" }}>Filter by Product</h4>
          <Select
            options={productOptions}
            onChange={(selectedOption) => setSelectedProduct(selectedOption)}
            isClearable
            placeholder="Select a product"
            styles={{
              container: (provided) => ({
                ...provided,
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }),
              control: (provided) => ({
                ...provided,
                borderColor: "#ddd",
                borderRadius: "8px",
                padding: "5px",
              }),
            }}
          />
        </div>

        {/* Date Range Picker */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h4 style={{ fontSize: "18px", marginBottom: "10px" }}>Filter by Date Range</h4>
          <div style={{ display: "flex", gap: "10px" }}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}
            />
          </div>
        </div>

        {/* Apply Filters Button */}
        <div style={{ alignSelf: "flex-end", flexShrink: "0" }}>
          <button
            onClick={applyFilters}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Bar Chart: Revenue by Product */}
      <div style={{ marginBottom: "40px" }}>
        <h4 style={{ fontSize: "20px", color: "#333" }}>Revenue by Product</h4>
        <BarChart width={600} height={300} data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
          <Bar dataKey="quantitySold" fill="#82ca9d" name="Quantity Sold" />
        </BarChart>
      </div>

   
    </div>
  );
};

export default SalesReport;
