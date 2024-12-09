import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Select, DatePicker, Row, Col, Card, Typography, Space, Button, Spin } from "antd";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

const ProductsReport = () => {
  const [salesData, setSalesData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6666", "#AA66FF"];

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/get/products/revenue`);
        const data = response.data.sellers;
        setSalesData(data);
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    };

    fetchSalesData();
  }, []);

  // Centralized filter function
  const filterData = (month, date, productName) => {
    let filtered = [...salesData];

    // Filter by month
    if (month) {
      filtered = filtered
        .map((seller) => ({
          ...seller,
          products: seller.products
            .map((product) => ({
              ...product,
              orders: product.orders.filter((order) => dayjs(order.date).format("MMMM") === month),
            }))
            .filter((product) => product.orders.length > 0),
        }))
        .filter((seller) => seller.products.length > 0);
    }

    // Filter by date
    if (date) {
      filtered = filtered
        .map((seller) => ({
          ...seller,
          products: seller.products
            .map((product) => ({
              ...product,
              orders: product.orders.filter((order) => dayjs(order.date).format("YYYY-MM-DD") === date),
            }))
            .filter((product) => product.orders.length > 0),
        }))
        .filter((seller) => seller.products.length > 0);
    }

    // Filter by product name
    if (productName) {
      filtered = filtered
        .map((seller) => ({
          ...seller,
          products: seller.products.filter((product) => product.name === productName),
        }))
        .filter((seller) => seller.products.length > 0);
    }

    setFilteredData(filtered);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    filterData(month, selectedDate, selectedProduct);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    filterData(selectedMonth, dateString, selectedProduct);
  };

  const handleProductChange = (productName) => {
    setSelectedProduct(productName);
    filterData(selectedMonth, selectedDate, productName);
  };

  const resetFilters = () => {
    setSelectedMonth(null);
    setSelectedDate(null);
    setSelectedProduct(null);
    setFilteredData(salesData);
  };

  if (!salesData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Prepare chart and table data
  const products = filteredData.flatMap((seller) => seller.products);

  const barData = products.map((product) => ({
    name: product.name,
    revenue: product.revenue,
    quantitySold: product.quantitySold,
  }));

  const pieData = products.map((product) => ({
    name: product.name,
    value: product.revenue,
  }));

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

  const monthOptions = dayjs.months().map((month) => (
    <Option key={month} value={month}>
      {month}
    </Option>
  ));

  const productOptions = salesData
    .flatMap((seller) => seller.products.map((product) => product.name))
    .map((name, index) => (
      <Option key={index} value={name}>
        {name}
      </Option>
    ));

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Sales Report</Title>

      <Card style={{ marginBottom: "20px" }}>
        <Title level={4}>
          Total Revenue:{" "}
          {filteredData.reduce((totalRevenue, seller) => {
            return (
              totalRevenue +
              seller.products.reduce((sellerRevenue, product) => {
                return sellerRevenue + product.orders.reduce((orderRevenue, order) => orderRevenue + order.revenue, 0);
              }, 0)
            );
          }, 0)}{" "}
          EGP
        </Title>
      </Card>

      {/* Filters */}
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
        <Col span={8}>
          <Space direction="vertical">
            <Title level={5}>Filter by Month</Title>
            <Select placeholder="Select Month" style={{ width: "100%" }} value={selectedMonth} onChange={handleMonthChange}>
              {monthOptions}
            </Select>
          </Space>
        </Col>

        <Col span={8}>
          <Space direction="vertical">
            <Title level={5}>Filter by Date</Title>
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} onChange={handleDateChange} />
          </Space>
        </Col>

        <Col span={8}>
          <Space direction="vertical">
            <Title level={5}>Filter by Product</Title>
            <Select placeholder="Select Product" style={{ width: "100%" }} value={selectedProduct} onChange={handleProductChange}>
              {productOptions}
            </Select>
          </Space>
        </Col>
      </Row>

      <Row justify="end" style={{ marginBottom: "20px" }}>
        <Button onClick={resetFilters}>Reset Filters</Button>
      </Row>

      {/* Table */}
      <Table columns={tableColumns} dataSource={products} rowKey={(record) => record.productId} pagination={{ pageSize: 5 }} style={{ marginBottom: "20px" }} />

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
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

export default ProductsReport;
