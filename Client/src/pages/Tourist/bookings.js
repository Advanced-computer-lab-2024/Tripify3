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
import { getUserId } from "../../utils/authUtils.js";

const Bookings = () => {
  const [view, setView] = useState("upcoming");
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const userId = getUserId();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/bookings/get/${userId}`);
        setBookings(response.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [userId]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const displayedBookings = view === "upcoming" ? bookings.upcoming : bookings.past;

  const handleViewDetails = (booking) => {
    const itemId = booking.itinerary ? booking.itinerary._id : booking.activity._id;
    const type = booking.type;
    navigate(`/tourist/booking-details/${itemId}/${type}`);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        {view === "upcoming" ? "Upcoming Bookings" : "Past Bookings"}
      </Typography>
      
      <ToggleButtonGroup
        color="primary"
        value={view}
        exclusive
        onChange={handleViewChange}
        aria-label="View selection"
        style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
      >
        <ToggleButton value="upcoming">Upcoming</ToggleButton>
        <ToggleButton value="past">Past</ToggleButton>
      </ToggleButtonGroup>

      <Grid container spacing={3}>
        {displayedBookings.map((booking) => (
          <Grid item xs={12} md={6} lg={4} key={booking._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{booking.itinerary ? booking.itinerary.name : booking.activity.name}</Typography>
                <Typography variant="body2">
                  Date: {booking.itinerary ? booking.itinerary.timeline.startTime : booking.activity.date}
                </Typography>
                <Typography variant="body2">
                  Price: ${booking.price}
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
