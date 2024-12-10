import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserProfile } from "../../services/tourist";
import { getUserId } from "../../utils/authUtils";
import { useParams } from "react-router-dom"; ///////
import { Card, Typography, CardMedia, Grid, Box, CircularProgress, Divider, Button, Modal, IconButton, Dialog, DialogContent, DialogActions } from "@mui/material";
import { AccessTime, Luggage, Star, Close, CheckCircleOutline } from "@mui/icons-material";
import { getUserType, setTouristData } from "../../utils/authUtils";

const LoadFlights = () => {
  const location = useLocation();
  const { id } = useParams(); /////////
  const userId1 = getUserId();
  const [currency, setCurrency] = useState("USD"); // Default currency///////////////
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // Query parameters
  const departure = queryParams.get("departure");
  const arrival = queryParams.get("arrival");
  const adults = parseInt(queryParams.get("adults")) || 0;
  const kids = parseInt(queryParams.get("kids")) || 0;
  const seatClass = queryParams.get("seatClass") || "economy";
  const travelDate = queryParams.get("travelDate");

  const totalTickets = adults + kids;
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingDialog, setBookingDialog] = useState(false); // Booking confirmation dialog

  const travelClassMap = {
    economy: 1,
    premiumEconomy: 2,
    business: 3,
    first: 4,
  };
  const travelClass = travelClassMap[seatClass];
  const userId = localStorage.getItem("userId"); // Retrieve user ID from local storage

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-CA");
  const formatDuration = (minutes) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  const formatPrice = (price) => price.toLocaleString("en-US", { style: "currency", currency: currency });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency); // Set user's selected currency
        console.log(response.data.userProfile.currency);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const apiUrl = `http://localhost:8000/flights/?departure_id=${departure}&arrival_id=${arrival}&outbound_date=${travelDate}&currency=USD&adults=${adults}&children=${kids}&travel_class=${travelClass}`;
        const response = await axios.get(apiUrl);
        setFlights(response.data);
      } catch (error) {
        console.error("Error fetching flight data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [departure, arrival, travelDate, adults, kids, travelClass, id, userId1]);

  const handleOpen = (flight) => {
    setSelectedFlight(flight);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFlight(null);
  };

  const exchangeRates = {
    USD: 1, // 1 EGP = 0.0204 USD (1 USD = 49 EGP)
    EUR: 0.93, // 1 EGP = 0.0192 EUR (1 EUR = 52 EGP)
    GBP: 0.77, // 1 EGP = 0.0159 GBP (1 GBP = 63 EGP)
    AUD: 1.52, // 1 EGP = 0.03125 AUD (1 AUD = 32 EGP)
    CAD: 1.39, // 1 EGP = 0.02857 CAD (1 CAD = 35 EGP)
    EGP: 49,
  };

  const formatCurrency = (amount) => {
    if (!currency) {
      return amount; // Fallback to amount if currency is not set
    }

    const value = Number(amount);

    // Convert amount from EGP to chosen currency if currency is EGP
    const convertedAmount = currency === "USD" ? value : value * exchangeRates[currency];

    console.log("converted amount", convertedAmount);

    // return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
    //   .format(convertedAmount);

    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(convertedAmount);

    return formattedAmount.replace(/(\D)(\d)/, "$1 $2");
  };
  // Book flight function
  const handleBookFlight = async () => {
    const flightDetails = `
     Flight: ${selectedFlight.airline} - ${selectedFlight.flightNumber}, 
    Departure: ${departure}, 
    Arrival: ${arrival}, 
    Seat Class: ${seatClass}, 
    Travel Date: ${formatDate(travelDate)}, 
    Departure Time: ${selectedFlight.departure.time}, 
    Arrival Time: ${selectedFlight.arrival.time}, 
    Duration: ${formatDuration(selectedFlight.duration)}, 
    Total Price: ${selectedFlight.price}
  `;

    // const booking = { tourist: userId, price: selectedFlight.price * 49, type: "Flight", details: flightDetails };

    navigate(`/tourist/payment/${selectedFlight.price * 49}/Flight/${null}/${null}/${null}/${null}/${null}/${flightDetails}`);
 
    // setTouristData(booking);

    // try {
    //   await axios.post("http://localhost:8000/tourist/booking/create", {
    //     tourist: userId,
    //     price: selectedFlight.price * 49,
    //     type: "Flight",
    //     details: flightDetails,
    //   });
    //   setBookingDialog(true); // Show booking confirmation dialog
    // } catch (error) {
    //   console.error("Error creating booking:", error);
    // }
  };

  const closeBookingDialog = () => {
    setBookingDialog(false);
    navigate("/tourist/homepage");
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Available Direct Flights
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress size={60} color="primary" />
        </Box>
      ) : flights.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="60vh"
          p={4}
          sx={{
            boxShadow: 3,
            borderRadius: 3,
            backgroundColor: "#f9f9f9",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" color="textSecondary" fontWeight="bold" gutterBottom>
            No flights available
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Sorry, there are no direct flights available from {departure} to {arrival} on {formatDate(travelDate)}.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{
              mt: 2,
              backgroundColor: "#e0e0e0",
              "&:hover": { backgroundColor: "#bdbdbd" },
            }}
          >
            Choose Another Date
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2} direction="column">
          {flights.map((flight, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  p: 2,
                  borderRadius: 3,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease", // Add transition for smooth effect
                  "&:hover": {
                    transform: "scale(1.03)", // Slightly scale up on hover
                    boxShadow: 6, // Increase shadow on hover
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CardMedia component="img" sx={{ width: 60, height: 60, borderRadius: 2, mr: 2 }} image={flight.airlineLogo} alt={`${flight.airline} logo`} />
                  <Box>
                    <Typography variant="h6">
                      {flight.airline} - {flight.flightNumber}
                    </Typography>
                    <Box display="flex" alignItems="center" color="text.secondary" mt={0.5}>
                      <Star fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">{flight.travelClass}</Typography>
                      <Luggage fontSize="small" sx={{ ml: 2, mr: 0.5 }} />
                      <Typography variant="body2">{flight.baggageAllowance || "2 bag"}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 2 }}>
                  <Box textAlign="center" flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(flight.departure.time)}
                    </Typography>
                    <Typography variant="h5">{new Date(flight.departure.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.departure.airport} ({departure})
                    </Typography>
                  </Box>
                  <Box textAlign="center" mx={2}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                      <span style={{ borderBottom: "1px dashed", width: "40px", marginRight: "4px" }}></span>
                      ✈️
                      <span style={{ borderBottom: "1px dashed", width: "40px", marginLeft: "4px" }}></span>
                    </Typography>
                    <Box sx={{ backgroundColor: "#f0f0f0", borderRadius: "4px", padding: "2px 8px", mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDuration(flight.duration)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box textAlign="center" flex={1}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(flight.arrival.time)}
                    </Typography>
                    <Typography variant="h5">{new Date(flight.arrival.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.arrival.airport} ({arrival})
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Typography variant="h6" color="primary">
                    Price: {formatCurrency(flight.price)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    This price is for {totalTickets} ticket(s) ({adults} adults, {kids} children)
                  </Typography>
                  <Box display="flex" justifyContent="flex-end">
                    <Button variant="contained" onClick={() => handleOpen(flight)} sx={{ backgroundColor: "#e8f5e9", color: "black", borderRadius: 1 }}>
                      View Details
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal for flight details */}
      <Modal open={open} onClose={handleClose} aria-labelledby="flight-details-title" aria-describedby="flight-details-description">
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography id="flight-details-title" variant="h6" component="h2">
              Flight Details
            </Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          {selectedFlight && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" color="primary" fontWeight="bold" textAlign="center" mb={2}>
                {selectedFlight.airline} - {selectedFlight.flightNumber}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box textAlign="center" sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Departure
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="black">
                    {selectedFlight.departure.airport} ({departure})
                  </Typography>
                  <Typography variant="body2">{new Date(selectedFlight.departure.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ height: 10, width: 10, backgroundColor: "primary.main", borderRadius: "50%", mr: 1 }} />
                  <Box sx={{ borderBottom: "1px dashed", width: "60px" }} />
                  <Box sx={{ height: 10, width: 10, backgroundColor: "secondary.main", borderRadius: "50%", ml: 1 }} />
                </Box>
                <Box textAlign="center" sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Arrival
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="black">
                    {selectedFlight.arrival.airport} ({arrival})
                  </Typography>
                  <Typography variant="body2">{new Date(selectedFlight.arrival.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Travel Class: <strong>{selectedFlight.travelClass}</strong>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Baggage Allowance: <strong>{selectedFlight.baggageAllowance || "2 bag"}</strong>
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Total Passengers:{" "}
                  <strong>
                    {totalTickets} (Adults: {adults}, Children: {kids})
                  </strong>
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box textAlign="center" sx={{ mt: 3 }}>
                <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
                  Price: {formatCurrency(selectedFlight.price)}
                </Typography>
                <Button variant="contained" color="secondary" sx={{ mt: 1 }} onClick={handleBookFlight}>
                  Book
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Booking confirmation dialog */}
      <Dialog open={bookingDialog} onClose={closeBookingDialog}>
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <CheckCircleOutline color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
            Booked
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Your flight has been successfully booked!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" fullWidth onClick={closeBookingDialog}>
            Return to Home
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoadFlights;
