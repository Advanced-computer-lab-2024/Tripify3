import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Select, MenuItem, FormControl, InputLabel, Card, Grid } from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getUserId } from "../../utils/authUtils.js"; // Get the userId for the API request

const TourGuideSalesReport = () => {
  const [salesData, setSalesData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);

  // Fetch sales data from the API
  const fetchSalesData = async () => {
    const userId = getUserId(); // Get the current logged-in user's ID
    try {
      const response = await axios.get(`http://localhost:8000/tourGuide/${userId}/revenue`);
      setSalesData(response.data);
      setFilteredData(response.data.itineraryStats);

      // Extract available months from booking data
      const months = [
        ...new Set(response.data.itineraryStats.flatMap((itinerary) => 
          itinerary.bookingDates.map((booking) => booking.month)
        ))
      ];
      setAvailableMonths(months);
    } catch (error) {
      console.error("Error fetching sales data", error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  // Handle filtering by month
  const handleMonthFilter = (event) => {
    setFilterMonth(event.target.value);
    const filtered = salesData.itineraryStats.filter(
      (itinerary) => itinerary.bookingDates.some((booking) => booking.month.toLowerCase() === event.target.value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Pie Chart Colors
  const COLORS = ['#FFBB28', '#FF8042', '#0088FE', '#00C49F'];

  // Prepare chart data
  const chartData = filteredData.map((itinerary) => ({
    name: itinerary.itineraryName,
    revenue: itinerary.revenue,
    bookingCount: itinerary.bookingCount,
  }));

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: "bold" }}>
        Tour Guide Sales Report
      </Typography>

      {/* Filter Section */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", marginBottom: 4 }}>
        <FormControl sx={{ width: "200px" }}>
          <InputLabel id="month-select-label">Filter by Month</InputLabel>
          <Select
            labelId="month-select-label"
            value={filterMonth}
            label="Filter by Month"
            onChange={handleMonthFilter}
            variant="outlined"
          >
            <MenuItem value="">All</MenuItem>
            {availableMonths.map((month, index) => (
              <MenuItem key={index} value={month.toLowerCase()}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Revenue Overview */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: 3, textAlign: "center", boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total Revenue</Typography>
            <Typography variant="h5">${salesData?.totalRevenue || 0}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ padding: 3, textAlign: "center", boxShadow: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total Paid Itineraries</Typography>
            <Typography variant="h5">{salesData?.numberOfPaidItineraries || 0}</Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Itinerary Breakdown - Pie Chart */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Revenue Distribution by Itinerary
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="revenue"
              nameKey="name"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Itinerary Breakdown - Bar Chart */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Booking Count by Itinerary
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="bookingCount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Detailed Itinerary Data */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Detailed Itinerary Data
      </Typography>
      <Grid container spacing={3}>
        {filteredData.map((itinerary) => (
          <Grid item xs={12} sm={6} md={4} key={itinerary.itineraryId}>
            <Card sx={{ padding: 3, boxShadow: 3 }}>
              <Typography variant="h6">{itinerary.itineraryName}</Typography>
              <Typography>Bookings: {itinerary.bookingCount}</Typography>
              <Typography>Revenue: ${itinerary.revenue}</Typography>
              <Typography>Distinct Users: {itinerary.distinctUserCount}</Typography>
              <Typography>Dates: {itinerary.bookingDates.map((date) => `${date.date} (${date.month})`).join(", ")}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TourGuideSalesReport;
