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
import { Table,  DatePicker, Row, Col, Card, Typography, Space, Button } from 'antd';
import Select from "react-select";
import { getUserId } from "../../utils/authUtils.js";
import { Spin } from "antd";
import dayjs from 'dayjs';

const SalesReport = () => {
  const [reportData, setReportData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
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
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6666", "#AA66FF"];

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

  const applyFilters = () => {
    let data = reportData.products;

    if (selectedProduct) {
      data = data.filter((product) => product.name === selectedProduct.value);
    }

    if (selectedDate) {
      console.log(selectedDate);
      console.log("-1-----1111111111111111111111");
      
      data = data.map((product) => ({
        ...product,
        orders: product.orders.filter((order) => {
          const orderDate = new Date(order.date).toISOString().split("T")[0];
          const selectedDay =  dayjs(selectedDate).format("YYYY-MM-DD")
          console.log(orderDate);
          console.log("==============");
          console.log(selectedDay);
          console.log("-1-1-1-1-1");
          
          return orderDate === selectedDay;
        }),
      })).filter((product) => product.orders.length > 0);
    }

    if (selectedMonth) {
      const monthValue = parseInt(selectedMonth.value, 10);
      data = data.map((product) => ({
        ...product,
        orders: product.orders.filter((order) => {
          const orderMonth = new Date(order.date).getMonth() + 1;
          return orderMonth === monthValue;
        }),
      })).filter((product) => product.orders.length > 0);
    }

    setFilteredData({
      ...reportData,
      products: data,
      totalRevenue: data.reduce(
        (sum, product) =>
          sum +
          product.orders.reduce((orderSum, order) => orderSum + order.revenue, 0),
        0
      ),
    });
  };

  const productOptions = reportData.products.map((product) => ({
    value: product.name,
    label: product.name,
  }));

  const barData = filteredData.products.map((product) => ({
    name: product.name,
    revenue: product.orders.reduce((sum, order) => sum + order.revenue, 0),
    quantitySold: product.orders.reduce((sum, order) => sum + order.quantity, 0),
  }));

  const pieData = filteredData.products.map((product) => ({
    name: product.name,
    value: product.orders.reduce((sum, order) => sum + order.revenue, 0),
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

        {/* Single Day Picker */}
        <div style={{ flex: "1", minWidth: "250px" }}>
          <h4 style={{ fontSize: "18px", marginBottom: "10px" }}>Filter by Date</h4>
        
            <DatePicker
              selected={selectedDate}
                  placeholder="Filter by Payment date"
                  onChange={(date) => setSelectedDate(date)}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
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

      {/* Charts Section */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        {/* Bar Chart */}
        <div style={{ flex: "1", minWidth: "300px", marginRight: "20px" }}>
          <h4 style={{ fontSize: "20px", color: "#333" }}>Revenue by Product</h4>
          <BarChart width={400} height={300} data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
            <Bar dataKey="quantitySold" fill="#82ca9d" name="Quantity Sold" />
          </BarChart>
        </div>

        {/* Pie Chart */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <h4 style={{ fontSize: "20px", color: "#333" }}>Revenue Distribution</h4>
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: "20px", fontSize: "16px" }}>
        <h4>Product Legend:</h4>
        <ul>
          {pieData.map((entry, index) => (
            <li key={index} style={{ color: COLORS[index % COLORS.length] }}>
              {entry.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SalesReport;
