import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserId } from "../../utils/authUtils.js"; // Utility function to get userId
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, Select, DatePicker, Row, Col, Card, Typography, Space, Button } from 'antd';
import { LineChart, Line } from 'recharts';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title } = Typography;

const TourGuideSalesReport = () => {
  const [salesData, setSalesData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const userId = getUserId(); // Get the userId for the API request

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tourGuide/${userId}/revenue`);
        setSalesData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSalesData();
  }, [userId]);

  // Filter data based on selected month or date
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    filterData(month, selectedDate);
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
    filterData(selectedMonth, dateString);
  };

  const filterData = (month, date) => {
    let filtered = salesData?.itineraries || [];

    if (month) {
      filtered = filtered.filter(item => item.startMonth === month);
    }

    if (date) {
      filtered = filtered.filter(item => dayjs(item.startDate).format('YYYY-MM-DD') === date);
    }

    setFilteredData({
      ...salesData,
      itineraries: filtered,
    });
  };

  // Reset filters to initial state (null)
  const resetFilters = () => {
    setSelectedMonth(null);
    setSelectedDate(null);
    setFilteredData(salesData); // Reset filtered data to original state
  };

  // Calculate total revenue, total distinct users, and distinct users per itinerary
  const totalRevenue = (filteredData?.itineraries || []).reduce((acc, item) => acc + (item.revenueFromItinerary || 0), 0);

  const totalDistinctUsers = new Set();
  (filteredData?.itineraries || []).forEach(item => {
    totalDistinctUsers.add(item.distinctUsersCount); // Add distinct user count for each itinerary
  });
  const totalDistinctUsersCount = totalDistinctUsers.size;

  const distinctUsersPerItinerary = (filteredData?.itineraries || []).map(item => ({
    itineraryName: item.itineraryName,
    distinctUsersCount: item.distinctUsersCount,
  }));

  // Prepare chart data for Pie Chart
  const pieData = (filteredData?.itineraries || []).map((item) => ({
    name: item.itineraryName,
    value: item.revenueFromItinerary,
  }));

  // Prepare chart data for Bar Chart (monthly revenue comparison)
  const barData = (filteredData?.itineraries || []).reduce((acc, item) => {
    const month = item.startMonth;
    if (!acc[month]) acc[month] = 0;
    acc[month] += item.revenueFromItinerary;
    return acc;
  }, {});

  const barChartData = Object.keys(barData).map((month) => ({
    month,
    revenue: barData[month],
  }));

  // Table columns configuration
  const columns = [
    {
      title: 'Itinerary Name',
      dataIndex: 'itineraryName',
      key: 'itineraryName',
      sorter: (a, b) => a.itineraryName.localeCompare(b.itineraryName),
    },
    {
      title: 'Revenue',
      dataIndex: 'revenueFromItinerary',
      key: 'revenueFromItinerary',
      sorter: (a, b) => a.revenueFromItinerary - b.revenueFromItinerary,
      render: (text) => <span>${text}</span>,
    },
    {
      title: 'Bookings',
      dataIndex: 'numberOfBookings',
      key: 'numberOfBookings',
      sorter: (a, b) => a.numberOfBookings - b.numberOfBookings,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Distinct Users',
      dataIndex: 'distinctUsersCount',
      key: 'distinctUsersCount',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Tour Guide Sales Report</Title>

      {/* Display total distinct users and total revenue */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Card title="Total Customers">
            <p>{totalDistinctUsersCount}</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Total Revenue">
            <p>${totalRevenue}</p>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Filters */}
        <Col span={6}>
          <Card title="Filters">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Select
                placeholder="Filter by month"
                value={selectedMonth}
                onChange={handleMonthChange}
                style={{ width: '100%' }}
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                  <Option key={month} value={month}>{month}</Option>
                ))}
              </Select>
              <DatePicker
                placeholder="Filter by start date"
                onChange={handleDateChange}
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
              />
              <Button type="primary" onClick={resetFilters} style={{ width: '100%' }}>
                Reset Filters
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Revenue Pie Chart */}
        <Col span={12}>
          <Card title="Revenue Distribution by Itinerary">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {pieData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8884d8" : "#82ca9d"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Monthly Revenue Bar Chart */}
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={12}>
          <Card title="Monthly Revenue">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Table of Itinerary Sales Data */}
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="Itinerary Sales Data">
            <Table
              columns={columns}
              dataSource={filteredData?.itineraries || []}
              pagination={{ pageSize: 5 }}
              rowKey="itineraryName"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TourGuideSalesReport;
