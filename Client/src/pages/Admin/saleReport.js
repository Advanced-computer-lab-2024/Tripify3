import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Collapse, IconButton, TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import { format } from 'date-fns';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

const SalesReport = () => {
  const [completedPayments, setCompletedPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orderBy, setOrderBy] = useState('amount');
  const [orderDirection, setOrderDirection] = useState('desc');
  const [openRow, setOpenRow] = useState(null);
  const [dateFilter, setDateFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/payments/visa/completed')
      .then((response) => response.json())
      .then((data) => {
        setCompletedPayments(data.completedPayments);
        calculatePaymentMethods(data.completedPayments);
      })
      .catch((error) => console.error('Error fetching payments:', error));
  }, []);

  const formatDate = (date) => {
    return format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
  };

  const calculatePaymentMethods = (data) => {
    let methods = {
      Visa: 0,
      Wallet: 0,
    };

    data.forEach((paymentGroup) => {
      paymentGroup.payments.forEach((payment) => {
        methods[payment.paymentMethod] += payment.amount;
      });
    });

    setPaymentMethods(Object.entries(methods).map(([method, amount]) => ({
      name: method,
      value: amount
    })));
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      if (orderDirection === 'asc') {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    });
  };

  const handleRowClick = (index) => {
    setOpenRow(openRow === index ? null : index);  // Toggle collapse on row click
  };

  const calculateAppRate = (paymentGroup) => {
    let appRate = 0;
    if (paymentGroup.type === 'Activity' || paymentGroup.type === 'Itinerary') {
      paymentGroup.payments.forEach((payment) => {
        if (payment.paymentMethod === 'Visa' || payment.paymentMethod === 'Wallet') {
          appRate += payment.amount * 0.1;
        }
      });
    }
    return appRate;
  };

  // Filter by date or month
  const filterPayments = (data) => {
    return data.filter((paymentGroup) => {
      // Filter by payment date range
      if (dateFilter) {
        const paymentDate = new Date(paymentGroup.payments[0].paymentDate);
        const selectedDate = new Date(dateFilter);
        if (paymentDate.toDateString() !== selectedDate.toDateString()) {
          return false;
        }
      }

      // Filter by payment month
      if (monthFilter) {
        const paymentMonth = format(new Date(paymentGroup.payments[0].paymentDate), 'yyyy-MM');
        if (paymentMonth !== monthFilter) {
          return false;
        }
      }

      return true;
    });
  };

  // Reset Filters
  const resetFilters = () => {
    setDateFilter('');
    setMonthFilter('');
  };

  // Function to download CSV
  const downloadCSV = () => {
    const data = filterPayments(completedPayments);
    const headers = ['Amount', 'Payment Method', 'Payment Date', 'Type', 'App Rate'];
    
    // Convert data into CSV format
    const csvRows = [
      headers.join(','), // Add the headers
      ...data.flatMap((paymentGroup) => 
        paymentGroup.payments.map((payment) => [
          payment.amount,
          payment.paymentMethod,
          formatDate(payment.paymentDate),
          paymentGroup.type,
          payment.paymentMethod === 'Visa' ? payment.amount * 0.1 : 0
        ].join(','))
      )
    ];

    // Create a Blob and trigger a download
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // Ensure the download is supported
      link.href = URL.createObjectURL(blob);
      link.download = 'sales_report.csv';
      link.click();
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Dashboard Section */}
      <Grid container spacing={4} justifyContent="space-between">
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Total Payments
            </Typography>
            <Typography variant="h4" color="primary">
              ${completedPayments.reduce((acc, group) => acc + group.totalAmount, 0).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              App Rate (Online Payments)
            </Typography>
            <Typography variant="h4" color="secondary">
              ${completedPayments.reduce((acc, group) => acc + calculateAppRate(group), 0).toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Total Distinct Customers
            </Typography>
            <Typography variant="h4" color="textPrimary">
              {completedPayments.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter Section */}
      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Select Date"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Payment Month</InputLabel>
            <Select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              label="Payment Month"
            >
              {[
  { value: '2024-11', label: 'November 2024' },
  { value: '2024-10', label: 'October 2024' },
  { value: '2024-09', label: 'September 2024' },
  { value: '2024-08', label: 'August 2024' },
  { value: '2024-07', label: 'July 2024' },
  { value: '2024-06', label: 'June 2024' },
  { value: '2024-05', label: 'May 2024' },
  { value: '2024-04', label: 'April 2024' },
  { value: '2024-03', label: 'March 2024' },
  { value: '2024-02', label: 'February 2024' },
  { value: '2024-01', label: 'January 2024' }
].map((month) => (
  <MenuItem key={month.value} value={month.value}>
    {month.label}
  </MenuItem>
))}

            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="outlined" onClick={resetFilters} sx={{ marginTop: 2 }}>
            Reset Filters
          </Button>
        </Grid>
      </Grid>

      {/* Download Button */}
      <Button variant="contained" color="primary" onClick={downloadCSV} sx={{ marginTop: 4 }}>
        Download CSV
      </Button>

      {/* Payments Table */}
      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
               
                  Amount
              </TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Payment Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>App Rate</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortData(filterPayments(completedPayments)).map((paymentGroup, index) => (
              <>
                {paymentGroup.payments.map((payment, rowIndex) => (
                  <TableRow key={rowIndex} onClick={() => handleRowClick(index)}>
                    <TableCell>{payment.amount}</TableCell>
                    <TableCell>{payment.paymentMethod}</TableCell>
                    <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                    <TableCell>{paymentGroup.type}</TableCell>
                    <TableCell>{(payment.paymentMethod === 'Visa' || payment.paymentMethod === 'Wallet') && paymentGroup.type!="Product" ? payment.amount * 0.1 : 0}</TableCell>
                  </TableRow>
                ))}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SalesReport;
