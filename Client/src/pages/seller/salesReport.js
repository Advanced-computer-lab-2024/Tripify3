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
  const [selectedMonth, setSelectedMonth] = useState(null);

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

  // Months for dropdown
  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

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
        }).length,
      })).filter((product) => product.quantitySold > 0);
    }

    // Filter by month
    if (selectedMonth) {
      const monthValue = selectedMonth.value;
      data = data.map((product) => ({
        ...product,
        saleDates: product.saleDates.filter((date) => {
          const saleDate = new Date(date);
          return saleDate.getMonth() + 1 === parseInt(monthValue, 10);
        }),
        quantitySold: product.saleDates.filter((date) => {
          const saleDate = new Date(date);
          return saleDate.getMonth() + 1 === parseInt(monthValue, 10);
        }).length,
      })).filter((product) => product.quantitySold > 0);
    }

    // Update filtered data
    setFilteredData({
      ...reportData,
      products: data,
      totalRevenue: data.reduce((sum, product) => sum + product.revenue, 0),
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

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "24px", color: "#333" }}>
        Sales Report for Seller
      </h2>

      <div style={{ marginBottom: "20px" }}>
        <h3 style={{ fontSize: "20px", color: "#333" }}>
          Total Revenue: {filteredData.totalRevenue} EGP
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
          />
        </div>

        {/* Month Dropdown */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h4 style={{ fontSize: "18px", marginBottom: "10px" }}>Filter by Month</h4>
          <Select
            options={monthOptions}
            onChange={(selectedOption) => setSelectedMonth(selectedOption)}
            isClearable
            placeholder="Select a month"
          />
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

      {/* Bar Chart */}
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
