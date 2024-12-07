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
    const [selectedItinerary, setSelectedItinerary] = useState(null); // New state for itinerary filter

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

    // Filter data based on selected month, date, or itinerary
    const handleMonthChange = (month) => {
      setSelectedMonth(month);
      filterData(month, selectedDate, selectedItinerary);
    };

    const handleDateChange = (date, dateString) => {
      setSelectedDate(dateString);
      filterData(selectedMonth, dateString, selectedItinerary);
    };

    const handleItineraryChange = (itinerary) => {
      setSelectedItinerary(itinerary);
      filterData(selectedMonth, selectedDate, itinerary);
    };

    const filterData = (month, date, itinerary) => {
      let filtered = salesData?.itineraries || [];
    
      // Filter by specific date (overrides month and itinerary filters for bookingDetails)
      if (date) {
        filtered = filtered.map((item) => {
          const filteredBookingDetails = item.bookingDetails.filter((booking) =>
            dayjs(booking.date).format("YYYY-MM-DD") === date
          );
    
          if (filteredBookingDetails.length > 0) {
            return {
              ...item,
              bookingDetails: filteredBookingDetails, // Keep only bookings for the specific date
              numberOfBookings: filteredBookingDetails.length, // Update the number of bookings
              revenueFromItinerary: filteredBookingDetails.reduce((sum, booking) => sum + booking.amount, 0), // Update revenue
            };
          }
          return null; // Exclude items without matching bookings
        }).filter((item) => item !== null); // Remove null values from the array
      }
    
      // Filter by month if date is not specified
      if (!date && month) {
        filtered = filtered.map((item) => {
          const filteredBookingDetails = item.bookingDetails.filter((booking) =>
            dayjs(booking.date).format("MMMM") === month
          );
    
          if (filteredBookingDetails.length > 0) {
            return {
              ...item,
              bookingDetails: filteredBookingDetails, // Keep only bookings for the specific month
              numberOfBookings: filteredBookingDetails.length, // Update the number of bookings
              revenueFromItinerary: filteredBookingDetails.reduce((sum, booking) => sum + booking.amount, 0), // Update revenue
            };
          }
          return null; // Exclude items without matching bookings
        }).filter((item) => item !== null); // Remove null values from the array
      }
    
      // Filter by itinerary
      if (itinerary) {
        filtered = filtered.filter((item) => item.itineraryName === itinerary);
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
      setSelectedItinerary(null);
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
      value: item.revenueFromItinerary * 0.9,
    }));

    // Prepare chart data for Bar Chart (monthly revenue comparison)
    const barData = (filteredData?.itineraries || []).reduce((acc, item) => {
      const month = item.startMonth;
      if (!acc[month]) acc[month] = 0;
      acc[month] += item.revenueFromItinerary ;
      return acc;
    }, {});

    const barChartData = Object.keys(barData).map((month) => ({
      month,
      revenue: barData[month] * 0.9,
    }));

    // Get all distinct itinerary names for the filter dropdown
    const itineraryOptions = [...new Set((salesData?.itineraries || []).map(item => item.itineraryName))];

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
        render: (text) => <span>{text * 0.9} EGP</span>,
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
            <Card title="Total Distinct Customers">
            <p>{salesData?.totalDistinctUsers || 0}</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Total Revenue">
              <p>{totalRevenue * 0.9} EGP</p>
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
                  placeholder="Filter by Payment date"
                  onChange={handleDateChange}
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
                <Select
                  placeholder="Filter by itinerary"
                  value={selectedItinerary}
                  onChange={handleItineraryChange}
                  style={{ width: '100%' }}
                >
                  {itineraryOptions.map((itinerary) => (
                    <Option key={itinerary} value={itinerary}>{itinerary}</Option>
                  ))}
                </Select>
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
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Table to Display Itinerary Sales */}
        <Table
          columns={columns}
          dataSource={filteredData?.itineraries || []}
          pagination={{ pageSize: 5 }}
          rowKey="itineraryName"
          style={{ marginTop: '20px' }}
        />
      </div>
    );
  };

  export default TourGuideSalesReport;
