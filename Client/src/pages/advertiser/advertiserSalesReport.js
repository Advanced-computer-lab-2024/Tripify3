import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUserId } from "../../utils/authUtils.js"; // Utility function to get userId
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, Select, DatePicker, Row, Col, Card, Typography, Space, Button } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title } = Typography;

const AdvertiserSalesReport = () => {
  const [salesData, setSalesData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null); // New state for activity filter

  const userId = getUserId(); // Get the userId for the API request

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/advertiser/${userId}/activityRevenue`);
        setSalesData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSalesData();
  }, [userId]);

  // Filter data based on selected month, date, or activity
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

  const filterData = (month, date, activity) => {
    let filtered = salesData?.activityStats || [];
  
    console.log("Original Data:", filtered);
  
    // Filter by payment month
    if (month) {
      filtered = filtered.filter(item =>
        item.bookingDatesAndMonths.some(
          booking => dayjs(booking.date).format('MMMM') === month
        )
      );
    }
  
    // Filter by payment date
    if (date) {
      console.log("Filter by Date:");
      console.log("Selected Date:", date);
  
      filtered = filtered
        .map(item => ({
          ...item,
          bookingDatesAndMonths: item.bookingDatesAndMonths.filter(booking => {
            const bookingDate = dayjs(booking.date).format('YYYY-MM-DD');
            if (bookingDate === date) {
              console.log("Matching Booking Date:", bookingDate);
            }
            return bookingDate === date;
          }),
        }))
        .filter(item => item.bookingDatesAndMonths.length > 0); // Keep only activities with matching bookings
    }
  
    // Filter by activity name
    if (activity) {
      filtered = filtered.filter(item => item.activityName === activity);
    }
  
    setFilteredData({
      ...salesData,
      activityStats: filtered,
    });
  
    console.log("Filtered Data:", filtered);
  };
  
  

  // Reset filters to initial state (null)
  const resetFilters = () => {
    setSelectedMonth(null);
    setSelectedDate(null);
    setSelectedActivity(null); // Reset activity filter
    setFilteredData(salesData); // Reset filtered data to original state
  };

 
  const totalRevenue = (filteredData?.activityStats || []).reduce((acc, item) => {
    const activityRevenue = item.bookingDatesAndMonths.reduce((sum, booking) => sum + booking.amount, 0);
    return acc + activityRevenue;
  }, 0);
  

  const totalDistinctUsers = new Set();
  (filteredData?.activityStats || []).forEach(item => {
    totalDistinctUsers.add(item.distinctUsers); // Add distinct user count for each activity
  });
  const totalDistinctUsersCount = totalDistinctUsers.size;

  const distinctUsersPerActivity = (filteredData?.activityStats || []).map(item => ({
    activityName: item.activityName,
    distinctUsersCount: item.distinctUsers,
  }));

  const pieData = (filteredData?.activityStats || []).map((item) => {
    const filteredRevenue = item.bookingDatesAndMonths.reduce((acc, booking) => acc + booking.amount, 0);
    return {
      name: item.activityName,
      value: filteredRevenue * 0.9, // Apply percentage reduction if required
    };
  });
  
  
  const barData = (filteredData?.activityStats || []).reduce((acc, item) => {
    item.bookingDatesAndMonths.forEach((booking) => {
      const month = dayjs(booking.date).format('MMMM');
      if (!acc[month]) acc[month] = 0;
      acc[month] += booking.amount; // Use the booking amount
    });
    return acc;
  }, {});
  
  const barChartData = Object.keys(barData).map((month) => ({
    month,
    revenue: barData[month] * 0.9, // Apply percentage reduction if required
  }));
  
  // Table columns configuration
  const columns = [
    {
      title: 'Activity Name',
      dataIndex: 'activityName',
      key: 'activityName',
      sorter: (a, b) => a.activityName.localeCompare(b.activityName),
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a, b) => a.revenue - b.revenue,
      render: (_, record) => {
        const filteredRevenue = record.bookingDatesAndMonths.reduce((acc, booking) => acc + booking.amount, 0);
        return <span>{(filteredRevenue * 0.9)} EGP</span>;
      },
    },
    {
      title: 'Bookings',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      render: (_, record) => record.bookingDatesAndMonths.length,
      sorter: (a, b) => a.bookingCount - b.bookingCount,
    },
    {
      title: 'Activity Date',
      dataIndex: 'activityDate',
      key: 'activityDate',
      render: (text) => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: 'Distinct Users',
      dataIndex: 'distinctUsers',
      key: 'distinctUsers',
    },
  ];

  // Get distinct activity names for the filter dropdown
  const activityOptions = [...new Set((salesData?.activityStats || []).map(item => item.activityName))];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Advertiser Sales Report</Title>

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
                placeholder="Filter by payment month"
                value={selectedMonth}
                onChange={handleMonthChange}
                style={{ width: '100%' }}
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                  <Option key={month} value={month}>{month}</Option>
                ))}
              </Select>
              <DatePicker
                placeholder="Filter by payment date"
                onChange={handleDateChange}
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
              />
              <Select
                placeholder="Filter by activity"
                value={selectedActivity}
                onChange={handleActivityChange}
                style={{ width: '100%' }}
              >
                {activityOptions.map((activity) => (
                  <Option key={activity} value={activity}>{activity}</Option>
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
          <Card title="Revenue Distribution by Activity">
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

      {/* Table of Activity Sales Data */}
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="Activity Sales Data">
            <Table
              dataSource={filteredData?.activityStats}
              columns={columns}
              rowKey="activityName"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdvertiserSalesReport;
