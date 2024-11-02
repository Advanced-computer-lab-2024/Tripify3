import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, Typography, CardMedia, Grid, Box } from "@mui/material";

const LoadFlights = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Extract query parameters from the URL
  const departure = queryParams.get("departure");
  const arrival = queryParams.get("arrival");
  const adults = queryParams.get("adults");
  const kids = queryParams.get("kids");
  const seatClass = queryParams.get("seatClass") || "economy";
  const travelDate = queryParams.get("travelDate");
  const returnDate = queryParams.get("returnDate");

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map seatClass to corresponding numeric value
  const seatClassMap = {
    economy: 1,
    premiumEconomy: 2,
    business: 3,
    first: 4,
  };

  const travelClass = seatClassMap[seatClass]; // Get corresponding travel class value

  // Helper function to format the date as "YYYY-MM-DD"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA"); // "YYYY-MM-DD" format
  };

  // Fetch flight data from the backend
  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);

      try {
        // Construct the URL for round trip flights
        let apiUrl = `http://localhost:8000/flights/?departure_id=${departure}&arrival_id=${arrival}&outbound_date=${travelDate}&return_date=${returnDate}&currency=USD&adults=${adults}&children=${kids}&travel_class=${travelClass}`;

        // Fetch flight data from backend
        const response = await axios.get(apiUrl);
        console.log(response.data);
        
        // Set flights data
        setFlights(response.data);
      } catch (error) {
        console.error("Error fetching flight data:", error);
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchFlights();
  }, [departure, arrival, travelDate, returnDate, adults, kids, travelClass]);

  return (
    <Box p={4}>
      <h1>Available Flights</h1>
      {loading ? (
        <p>Loading flights...</p>
      ) : (
        <Grid container spacing={2}>
          {flights.map((flight, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ display: "flex", boxShadow: 3 }}>
                {/* Airline Logo */}
                <CardMedia component="img" sx={{ width: 120 }} image={flight.airlineLogo} alt={`${flight.airline} logo`} />

                {/* Flight Information */}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {flight.airline} - {flight.flightNumber}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Departure: {flight.departure.airport} at {formatDate(flight.departure.time)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Arrival: {flight.arrival.airport} at {formatDate(flight.arrival.time)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {flight.duration} mins
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Travel Class: {flight.travelClass}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      Price: ${flight.price}
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default LoadFlights;
