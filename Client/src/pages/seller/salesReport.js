import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserId } from "../../utils/authUtils.js";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Table, Select, DatePicker, Row, Col, Card, Typography, Space, Button, Spin } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

const SalesReport = () => {
  const [salesData, setSalesData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null); // New activity filter

  const userId = getUserId();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/revenue/${userId}`);
        setSalesData(response.data);
        setFilteredData(response.data); // Initially, show all data
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    };

    fetchSalesData();
  }, [userId]);

  // Centralized filter function
  const filterData = (month, date, activity) => {
    let filtered = salesData?.products || [];

    // Filter by month
    if (month) {
      filtered = filtered.filter((product) =>
        product.orders.some(
          (order) => dayjs(order.date).format("MMMM") === month
        )
      );
    }

    // Filter by date
    if (date) {
      filtered = filtered.map((product) => ({
        ...product,
        orders: product.orders.filter(
          (order) => dayjs(order.date).format("YYYY-MM-DD") === date
        ),
      })).filter((product) => product.orders.length > 0);
    }

    // Filter by activity
    if (activity) {
      filtered = filtered.filter((product) => product.name === activity);
    }

    setFilteredData({
      ...salesData,
      products: filtered,
      totalRevenue: filtered.reduce(
        (sum, product) =>
          sum +
          product.orders.reduce((orderSum, order) => orderSum + order.revenue, 0),
        0
      ),
    });
  };

  // Handle filter changes
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    filterData(month, selectedDate, selectedActivity);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    filterData(selectedMonth, dateString, selectedActivity);
  };

  const handleActivityChange = (activity) => {
    setSelectedActivity(activity);
    filterData(selectedMonth, selectedDate, activity);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedMonth(null);
    setSelectedDate(null);
    setSelectedActivity(null);
    setFilteredData(salesData);
  };

  if (!salesData) {
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

  const tableColumns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price} EGP`,
    },
    {
      title: "Quantity Sold",
      dataIndex: "quantitySold",
      key: "quantitySold",
    },
    {
      title: "Total Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue) => `${revenue} EGP`,
    },
  ];


  const barData = filteredData.products.map((product) => ({
    name: product.name,
    revenue: product.orders.reduce((sum, order) => sum + order.revenue, 0),
    quantitySold: product.orders.reduce((sum, order) => sum + order.quantity, 0),
  }));

  const pieData = filteredData.products.map((product) => ({
    name: product.name,
    value: product.orders.reduce((sum, order) => sum + order.revenue, 0),
  }));

  const monthOptions = dayjs.months().map((month) => ({
    value: month,
    label: month,
  }));

  const activityOptions = salesData.products.map((product) => ({
    value: product.name,
    label: product.name,
  }));

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Sales Report for Seller</Title>

      <Card style={{ marginBottom: "20px" }}>
        <Title level={4}>Total Revenue: {filteredData.totalRevenue} EGP</Title>
      </Card>

      {/* Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Space direction="vertical">
            <Title level={5}>Filter by Month</Title>
            <Select
              placeholder="Select Month"
              style={{ width: "100%" }}
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {monthOptions.map((month) => (
                <Option key={month.value} value={month.value}>
                  {month.label}
                </Option>
              ))}
            </Select>
          </Space>
        </Col>

        <Col span={8}>
          <Space direction="vertical">
            <Title level={5}>Filter by Date</Title>
            <DatePicker
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              onChange={handleDateChange}
            />
          </Space>
        </Col>

        <Col span={8}>
          <Space direction="vertical">
            <Title level={5}>Filter by Product</Title>
            <Select
              placeholder="Select Product"
              style={{ width: "100%" }}
              value={selectedActivity}
              onChange={handleActivityChange}
            >
              {activityOptions.map((activity) => (
                <Option key={activity.value} value={activity.value}>
                  {activity.label}
                </Option>
              ))}
            </Select>
          </Space>
        </Col>
      </Row>

      <Row justify="end" style={{ marginBottom: "20px" }}>
        <Button onClick={resetFilters}>Reset Filters</Button>
      </Row>

            {/* Table */}
            <Table columns={tableColumns} dataSource={filteredData.products} rowKey={(record) => record.productId} pagination={{ pageSize: 5 }} style={{ marginBottom: "20px" }} />


      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="Revenue by Product">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="quantitySold" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
  <Card title="Revenue Distribution">
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {pieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  </Card>
</Col>

      </Row>
    </div>
  );
};

export default SalesReport;
