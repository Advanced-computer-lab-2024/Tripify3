import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserId, getUserType } from "../../utils/authUtils.js";
import { getUserProfile } from "../../services/tourist";
import EventIcon from "@mui/icons-material/Event";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import TimelineIcon from "@mui/icons-material/Timeline";
import PaymentIcon from "@mui/icons-material/Payment";
import PaidIcon from "@mui/icons-material/Paid";

const Bookings = () => {
  const [view, setView] = useState("upcoming");
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const userId = getUserId();
  const [currency, setCurrency] = useState("USD");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/bookings/get/${userId}`);
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
    fetchUserProfile();
  }, [userId]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const exchangeRates = {
    USD: 1 / 49,
    EUR: 1 / 52,
    GBP: 1 / 63,
    AUD: 1 / 32,
    CAD: 1 / 35,
  };

  const formatCurrency = (amount) => {
    if (!currency) {
      return amount;
    }
    const value = Number(amount);
    if (getUserType() !== "Tourist") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(value);
    }

    const convertedAmount = currency === "EGP" ? value : value * exchangeRates[currency];
    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(convertedAmount);

    return formattedAmount.replace(/(\D)(\d)/, "$1 $2");
  };

  const displayedBookings = view === "upcoming" ? bookings.upcoming : bookings.past;

  const handleViewDetails = (booking) => {
    const itemId = booking.itinerary ? booking.itinerary._id : booking.activity._id;
    const type = booking.type;
    const bookingId = booking._id;
    navigate(`/tourist/booking-details/${itemId}/${type}/${view}/${bookingId}`);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom style={{ fontWeight: "bold", color: "#1976d2" }}>
        {view === "upcoming" ? "📅 Upcoming Bookings" : "📜 Past Bookings"}
      </Typography>

      <ToggleButtonGroup
        color="primary"
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="View selection"
        style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
      >
        <ToggleButton value="past">Past</ToggleButton>
        <ToggleButton value="upcoming">Upcoming</ToggleButton>
      </ToggleButtonGroup>

      <Grid container spacing={3}>
        {displayedBookings.map((booking) => (
          <Grid item xs={12} md={6} lg={4} key={booking._id}>
            <Card
              style={{
                backgroundColor: booking.type === "Activity" ? "#e0f7fa" : "#fce4ec",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <CardContent>
                <Typography variant="h6" style={{ fontWeight: "bold" }}>
                  {booking.itinerary ? <TimelineIcon /> : <LocalActivityIcon />}
                  {booking.itinerary ? booking.itinerary.name : booking.activity.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <EventIcon /> Date:{" "}
                  {new Date(booking.itinerary ? booking.itinerary.timeline.startTime : booking.activity.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <AttachMoneyIcon /> Price: {formatCurrency(booking.price)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {booking.paymentStatus === "Unpaid" ? <PaymentIcon /> : <PaidIcon />} Payment Status: {booking.paymentStatus}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleViewDetails(booking)}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Bookings;
