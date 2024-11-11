import React, { useState } from "react";
import { Box, Button, MenuItem, Select, FormControl, InputLabel, TextField, Typography, Paper, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Flights = () => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [seatClass, setSeatClass] = useState("economy");
  const [travelDate, setTravelDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const validateFields = () => {
    const currentDate = new Date();
    const travel = new Date(travelDate);

    if (!departure) return "Departure airport is required.";
    if (!arrival) return "Arrival airport is required.";
    if (!travelDate) return "Travel date is required.";
    if (!adults || adults < 1) return "There must be at least one adult.";

    if (travel < currentDate.setHours(0, 0, 0, 0)) {
      return "Travel date cannot be in the past.";
    }

    return "";
  };

  const handleSearch = () => {
    const error = validateFields();
    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage("");
    const queryParams = new URLSearchParams({
      departure,
      arrival,
      adults,
      kids,
      seatClass,
      travelDate,
    }).toString();

    navigate(`/load_flights?${queryParams}`);
  };

  // Predefined list of major airports in Europe, North America, and Asia
  const airportOptions = [
    // Europe
    { city: "London", code: "LHR" },
    { city: "Paris", code: "CDG" },
    { city: "Frankfurt", code: "FRA" },
    { city: "Amsterdam", code: "AMS" },
    { city: "Madrid", code: "MAD" },
    { city: "Rome", code: "FCO" },
    { city: "Istanbul", code: "IST" },
    { city: "Zurich", code: "ZRH" },
    { city: "Vienna", code: "VIE" },
    { city: "Munich", code: "MUC" },
    { city: "Barcelona", code: "BCN" },
    { city: "Dublin", code: "DUB" },
    { city: "Copenhagen", code: "CPH" },
    { city: "Oslo", code: "OSL" },
    { city: "Stockholm", code: "ARN" },
    { city: "Helsinki", code: "HEL" },
    { city: "Brussels", code: "BRU" },
    { city: "Lisbon", code: "LIS" },
    { city: "Moscow", code: "SVO" },
    { city: "Warsaw", code: "WAW" },
    { city: "Athens", code: "ATH" },
    { city: "Budapest", code: "BUD" },
    { city: "Prague", code: "PRG" },
    { city: "Milan", code: "MXP" },
    { city: "Geneva", code: "GVA" },
    { city: "Hamburg", code: "HAM" },
    { city: "Nice", code: "NCE" },

    // North America
    { city: "New York", code: "JFK" },
    { city: "Los Angeles", code: "LAX" },
    { city: "Chicago", code: "ORD" },
    { city: "Toronto", code: "YYZ" },
    { city: "Vancouver", code: "YVR" },
    { city: "Miami", code: "MIA" },
    { city: "San Francisco", code: "SFO" },
    { city: "Atlanta", code: "ATL" },
    { city: "Boston", code: "BOS" },
    { city: "Dallas", code: "DFW" },
    { city: "Houston", code: "IAH" },
    { city: "Washington D.C.", code: "IAD" },
    { city: "Denver", code: "DEN" },
    { city: "Seattle", code: "SEA" },
    { city: "Montreal", code: "YUL" },
    { city: "Philadelphia", code: "PHL" },
    { city: "Orlando", code: "MCO" },
    { city: "Phoenix", code: "PHX" },
    { city: "Detroit", code: "DTW" },
    { city: "Minneapolis", code: "MSP" },
    { city: "Mexico City", code: "MEX" },
    { city: "Las Vegas", code: "LAS" },
    { city: "Charlotte", code: "CLT" },
    { city: "Calgary", code: "YYC" },
    { city: "Tampa", code: "TPA" },
    { city: "Salt Lake City", code: "SLC" },

    // Asia & Middle East
    { city: "Dubai", code: "DXB" },
    { city: "Abu Dhabi", code: "AUH" },
    { city: "Tokyo", code: "HND" },
    { city: "Tokyo Narita", code: "NRT" },
    { city: "Hong Kong", code: "HKG" },
    { city: "Seoul", code: "ICN" },
    { city: "Beijing", code: "PEK" },
    { city: "Shanghai", code: "PVG" },
    { city: "Singapore", code: "SIN" },
    { city: "Bangkok", code: "BKK" },
    { city: "Mumbai", code: "BOM" },
    { city: "Delhi", code: "DEL" },
    { city: "Jakarta", code: "CGK" },
    { city: "Kuala Lumpur", code: "KUL" },
    { city: "Manila", code: "MNL" },
    { city: "Riyadh", code: "RUH" },
    { city: "Jeddah", code: "JED" },
    { city: "Doha", code: "DOH" },
    { city: "Kuwait City", code: "KWI" },
    { city: "Bahrain", code: "BAH" },
    { city: "Amman", code: "AMM" },
    { city: "Karachi", code: "KHI" },
    { city: "Islamabad", code: "ISB" },
    { city: "Kathmandu", code: "KTM" },
    { city: "Colombo", code: "CMB" },
  ];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: "100%", maxWidth: 500, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" align="center" sx={{ mb: 3, color: "primary.main" }}>
          Book a One-Way Direct Flight
        </Typography>

        {errorMessage && (
          <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
            {errorMessage}
          </Typography>
        )}

        {/* Autocomplete for Departure Airport */}
        <Autocomplete
          options={airportOptions}
          getOptionLabel={(option) => `${option.city} (${option.code})`}
          renderInput={(params) => <TextField {...params} label="Departure Airport" variant="outlined" required />}
          onChange={(event, newValue) => setDeparture(newValue ? newValue.code : "")}
          sx={{ mb: 2 }}
          fullWidth
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Arrival Airport (Egypt)</InputLabel>
          <Select value={arrival} onChange={(e) => setArrival(e.target.value)} required sx={{ backgroundColor: "white", borderRadius: 1 }}>
            <MenuItem value="CAI">Cairo - Cairo International Airport (CAI)</MenuItem>
            <MenuItem value="HRG">Hurghada - Hurghada International Airport (HRG)</MenuItem>
            <MenuItem value="ASW">Aswan - Aswan International Airport (ASW)</MenuItem>
            <MenuItem value="LXR">Luxor - Luxor International Airport (LXR)</MenuItem>
            <MenuItem value="ALY">Alexandria - Borg El Arab Airport (ALY)</MenuItem>
            <MenuItem value="SSH">Sharm El Sheikh - Sharm El Sheikh International Airport (SSH)</MenuItem>
            <MenuItem value="RMF">Marsa Alam - Marsa Alam International Airport (RMF)</MenuItem>
            <MenuItem value="MUH">Mersa Matruh - Mersa Matruh Airport (MUH)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="date"
          label="Travel Date"
          value={travelDate}
          onChange={(e) => setTravelDate(e.target.value)}
          sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
          InputLabelProps={{ shrink: true }}
          required
          fullWidth
        />

        <TextField
          type="number"
          label="Adults"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
          InputProps={{ inputProps: { min: 1 } }}
          required
          fullWidth
        />

        <TextField
          type="number"
          label="Kids"
          value={kids}
          onChange={(e) => setKids(e.target.value)}
          sx={{ mb: 2, backgroundColor: "white", borderRadius: 1 }}
          InputProps={{ inputProps: { min: 0 } }}
          fullWidth
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Seat Class</InputLabel>
          <Select value={seatClass} onChange={(e) => setSeatClass(e.target.value)} required sx={{ backgroundColor: "white", borderRadius: 1 }}>
            <MenuItem value="economy">Economy</MenuItem>
            <MenuItem value="business">Business</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleSearch} fullWidth sx={{ py: 1.5, fontSize: "1rem" }}>
          Search Flights
        </Button>
      </Paper>
    </Box>
  );
};

export default Flights;
