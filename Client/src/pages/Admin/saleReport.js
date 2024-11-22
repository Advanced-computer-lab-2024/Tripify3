import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Button } from "@mui/material";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import dayjs from "dayjs";
import { CSVLink } from "react-csv";

// Mock Data
const salesData = [
  { category: "Events", grossRevenue: 10000, appRateDeduction: 1000, netRevenue: 9000 },
  { category: "Itineraries", grossRevenue: 8000, appRateDeduction: 800, netRevenue: 7200 },
  { category: "Gift Shop", grossRevenue: 2500, appRateDeduction: 0, netRevenue: 2500 },
];

const chartColors = ["#FF6384", "#36A2EB", "#FFCE56"];

const SaleReport = () => {
  // Prepare the data for CSV export
  const csvData = salesData.map(row => ({
    Category: row.category,
    GrossRevenue: row.grossRevenue,
    AppRateDeduction: row.appRateDeduction,
    NetRevenue: row.netRevenue
  }));

  return (
    <Box sx={{ padding: 4 }}>
      {/* Title */}
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
        Sales Report
      </Typography>

      {/* CSV Download Button */}
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <CSVLink
          data={csvData}
          filename={"sales_report.csv"}
          className="btn btn-primary"
          style={{
            backgroundColor: "#36A2EB",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Download CSV
        </CSVLink>
      </Box>

      {/* Charts and Data */}
      <Grid container spacing={4}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
            Revenue Breakdown
          </Typography>
          <PieChart width={400} height={300}>
            <Pie
              data={salesData}
              dataKey="netRevenue"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {salesData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
            Gross Revenue vs Net Revenue
          </Typography>
          <BarChart
            width={500}
            height={300}
            data={salesData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="grossRevenue" fill="#36A2EB" name="Gross Revenue" />
            <Bar dataKey="netRevenue" fill="#FF6384" name="Net Revenue" />
          </BarChart>
        </Grid>

        {/* Table */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
            Detailed Sales Report
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Gross Revenue</TableCell>
                  <TableCell align="right">App Rate Deduction (10%)</TableCell>
                  <TableCell align="right">Net Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesData.map((row) => (
                  <TableRow key={row.category}>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right">${row.grossRevenue.toLocaleString()}</TableCell>
                    <TableCell align="right">${row.appRateDeduction.toLocaleString()}</TableCell>
                    <TableCell align="right">${row.netRevenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SaleReport;
