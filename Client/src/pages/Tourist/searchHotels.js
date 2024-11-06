import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SearchHotels = () => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [childrenAges, setChildrenAges] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State to store error messages

  const navigate = useNavigate();

  const validateFields = () => {
    if (!checkInDate) return "Check-in date is required.";
    if (!checkOutDate) return "Check-out date is required.";
    if (!adults || adults < 1) return "Number of adults is required and must be at least 1.";
    if (children < 0) return "Number of children cannot be negative.";
    if (children > 0 && childrenAges.some((age) => age === "")) return "Please enter age for each child.";

    const dateError = validateDates();
    if (dateError) return dateError;

    return ""; // No errors
  };

  const validateDates = () => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn < today.setHours(0, 0, 0, 0)) {
      return "Check-in date cannot be in the past.";
    }

    if (checkOut <= checkIn) {
      return "Check-out date must be after the check-in date.";
    }

    return ""; // No errors
  };

  // Update children ages dynamically based on the number of children
  const handleChildrenChange = (value) => {
    setChildren(value);
    setChildrenAges(Array.from({ length: value }, () => "")); // Initialize an array with empty strings
  };

  const handleChildrenAgeChange = (index, age) => {
    const updatedAges = [...childrenAges];
    updatedAges[index] = age;
    setChildrenAges(updatedAges);
  };

  const handleSearch = () => {
    const fieldError = validateFields();
    if (fieldError) {
      setErrorMessage(fieldError);
      return;
    }

    // Clear any existing error message
    setErrorMessage("");

    const queryParams = new URLSearchParams({
      check_in_date: checkInDate,
      check_out_date: checkOutDate,
      adults,
      children,
      children_ages: children > 0 ? childrenAges.filter((age) => age !== "").join(",") : "0", // Send "0" if no children
    }).toString();

    navigate(`/load_hotels?${queryParams}`);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 500, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 3, color: "primary.main" }}>
          Search for Hotels
        </Typography>

        {errorMessage && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {errorMessage}
          </Typography>
        )}

        <TextField type="date" label="Check-in Date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} required />

        <TextField type="date" label="Check-out Date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} fullWidth sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} required />

        <TextField type="number" label="Number of Adults" value={adults} onChange={(e) => setAdults(e.target.value)} fullWidth sx={{ mb: 2 }} InputProps={{ inputProps: { min: 1 } }} required />

        <TextField
          type="number"
          label="Number of Children"
          value={children}
          onChange={(e) => handleChildrenChange(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          InputProps={{ inputProps: { min: 0 } }}
          required
        />

        {/* Conditional rendering for children ages */}
        {children > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Enter ages of children:
            </Typography>
            <Grid container spacing={2}>
              {childrenAges.map((age, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <TextField
                    type="number"
                    label={`Child ${index + 1}`}
                    value={age}
                    onChange={(e) => handleChildrenAgeChange(index, e.target.value)}
                    fullWidth
                    InputProps={{ inputProps: { min: 0, max: 17 } }}
                    required
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Button variant="contained" color="primary" onClick={handleSearch} fullWidth sx={{ py: 1.5, fontSize: "1rem" }}>
          Search Hotels
        </Button>
      </Paper>
    </Box>
  );
};

export default SearchHotels;
