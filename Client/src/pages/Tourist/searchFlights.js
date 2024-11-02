import React, { useState } from "react";
import { Box, Button, MenuItem, Select, FormControl, InputLabel, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Flights = () => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [seatClass, setSeatClass] = useState("economy");
  const [travelDate, setTravelDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error messages

  const navigate = useNavigate(); // Hook for navigation

  // Helper function to validate the dates
  const validateDates = () => {
    const currentDate = new Date();
    const travel = new Date(travelDate);
    const returnTrip = new Date(returnDate);

    // Check if travel date is not in the past
    if (travel < currentDate.setHours(0, 0, 0, 0)) {
      return "Travel date cannot be in the past.";
    }

    // Check if return date is after travel date
    if (returnDate && returnTrip < travel) {
      return "Return date cannot be before the travel date.";
    }

    return ""; // No errors
  };

  const handleSearch = () => {
    // Validate the dates before searching
    const error = validateDates();
    if (error) {
      setErrorMessage(error); // Set the error message
      return; // Stop the search if validation fails
    }

    // Clear any existing error message
    setErrorMessage("");

    // Handle search logic or pass data as query params to load_flights page
    const queryParams = new URLSearchParams({
      departure,
      arrival,
      adults,
      kids,
      seatClass,
      travelDate,
      returnDate,
    }).toString();

    // Navigate to /load_flights with the query params
    navigate(`/load_flights?${queryParams}`);
  };

  return (
    <Box p={4}>
      <h1>Flights Page</h1>
      <p>Welcome to the Flights page. Here you can search for round-trip flights.</p>

      {/* Error Message Display */}
      {errorMessage && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {/* Departure Airport (International) */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Departure Airport (World)</InputLabel>
        <Select value={departure} onChange={(e) => setDeparture(e.target.value)}>
          <MenuItem value="AUH">AbuDhabi (AUH)</MenuItem>
          <MenuItem value="LAX">LA (LAX)</MenuItem>
          <MenuItem value="JFK">New York (JFK)</MenuItem>
          <MenuItem value="LHR">London (LHR)</MenuItem>
          <MenuItem value="CDG">Paris (CDG)</MenuItem>
          {/* Add more international airports as needed */}
        </Select>
      </FormControl>

      {/* Arrival Airport (Egypt) */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Arrival Airport (Egypt)</InputLabel>
        <Select value={arrival} onChange={(e) => setArrival(e.target.value)}>
          <MenuItem value="CAI">Cairo (CAI)</MenuItem>
          <MenuItem value="HRG">Hurghada (HRG)</MenuItem>
          <MenuItem value="ASW">Aswan (ASW)</MenuItem>
          {/* Add more airports in Egypt as needed */}
        </Select>
      </FormControl>

      {/* Travel Date */}
      <TextField
        type="date"
        label="Travel Date"
        value={travelDate}
        onChange={(e) => setTravelDate(e.target.value)}
        sx={{ mb: 2, width: "100%" }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {/* Return Date */}
      <TextField
        type="date"
        label="Return Date"
        value={returnDate}
        onChange={(e) => setReturnDate(e.target.value)}
        sx={{ mb: 2, width: "100%" }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {/* Adults Input */}
      <TextField
        type="number"
        label="Adults"
        value={adults}
        onChange={(e) => setAdults(e.target.value)}
        sx={{ mb: 2, width: "100%" }}
        InputProps={{ inputProps: { min: 1 } }} // Ensure minimum of 1 adult
      />

      {/* Kids Input */}
      <TextField
        type="number"
        label="Kids"
        value={kids}
        onChange={(e) => setKids(e.target.value)}
        sx={{ mb: 2, width: "100%" }}
        InputProps={{ inputProps: { min: 0 } }} // Ensure minimum of 0 kids
      />

      {/* Seat Class */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Seat Class</InputLabel>
        <Select value={seatClass} onChange={(e) => setSeatClass(e.target.value)}>
          <MenuItem value="economy">Economy</MenuItem>
          <MenuItem value="premiumEconomy">Premium Economy</MenuItem>
          <MenuItem value="business">Business</MenuItem>
          <MenuItem value="first">First Class</MenuItem>
        </Select>
      </FormControl>

      {/* Search Button */}
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search Flights
      </Button>
    </Box>
  );
};

export default Flights;
