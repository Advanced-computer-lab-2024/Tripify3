import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Grid, Card, CardContent, CardActions, IconButton, Dialog, Slide, Select, MenuItem, Paper, Rating } from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  MonetizationOn as MonetizationOnIcon,
  Star as StarIcon,
  EventNote as EventNoteIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Link as LinkIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import axios from "axios";
import { getUserId, getUserType } from "../../utils/authUtils";

const PlaceDetails = () => {
  const { id } = useParams();
  const userType = getUserType();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userCategory, setUserCategory] = useState("foreigner");

  const handleIncrease = () => setTicketCount(ticketCount + 1);
  const handleDecrease = () => ticketCount > 1 && setTicketCount(ticketCount - 1);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/place/get/${id}`);
        setPlace(response.data.data.place);
        setReviews(response.data.data.reviews);
        setTotalPrice(response.data.data.place.ticketPrices.foreigner);
        setLoading(false);
      } catch (error) {
        setError("Error fetching place details");
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  useEffect(() => {
    if (place) {
      const pricePerTicket = place.ticketPrices[userCategory];
      setTotalPrice(ticketCount * pricePerTicket);
    }
  }, [ticketCount, userCategory, place]);

  const handleUserCategoryChange = (event) => {
    setUserCategory(event.target.value);
  };

  const BookPlace = async () => {
    const tourist = getUserId();
    const booking = { tourist, price: totalPrice, type: "Place", itemId: place._id, tickets: ticketCount };

    try {
      const response = await axios.post(`http://localhost:8000/tourist/booking/create`, booking);
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending booking:", error);
    }
  };

  const handleCopyLink = () => {
    const link = `http://localhost:3000/place/${place._id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
      setShareOpen(false);
    });
  };

  const handleShareToggle = () => setShareOpen(!shareOpen);
  
  const handleEmailShare = () => {
    const emailSubject = `Check out this place: ${place.name}`;
    // Construct email body with additional itinerary details
    const emailBody =
      `I thought you might be interested in visiting this place!\n\n` +
      `Place Name: ${place.name}\n` +
      `Address: ${place.location.address}\n` +
      `Ticket Prices:\n` +
      `  - For foreigners: $${place.ticketPrices.foreigner}\n` +
      `  - For natives: $${place.ticketPrices.native}\n` +
      `  - For students: $${place.ticketPrices.student}\n\n` +
      `View more details here: http://localhost:3000/place/${place._id}`;

    // Construct Gmail URL for pre-filled subject and body
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Open Gmail in a new window or tab in Chrome
    window.open(gmailUrl, "_blank");
  };


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ position: "absolute", top: 16, left: 16, fontSize: "1rem", fontWeight: 500 }}>
        Go Back
      </Button>

      <Grid container spacing={4} sx={{ mt: 5 }}>
        {/* Place Details Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ width: "100%", borderRadius: 3, boxShadow: 5, padding: 4, minHeight: "500px" }}>
            <CardContent>
              <Typography variant="h4" color="#333" gutterBottom textAlign="center" sx={{ mb: 3 }}>
                {place.name}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                    <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                      {place.location.address}, {place.location.city}, {place.location.country}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MonetizationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                    <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                      Ticket Price: ${place.ticketPrices[userCategory]}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" color="#333" sx={{ mt: 2 }}>
                    Opening Hours:
                  </Typography>
                  {place.openingHours.map((hours, index) => (
                    <Typography key={index} variant="body1" color="#666">
                      {hours.day}: {hours.from} - {hours.to}
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" color="#333" sx={{ mt: 1 }}>
                    Tags: {place.tags.map((tag) => tag.name).join(", ")}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" color="#333" sx={{ mt: 2 }}>
                Total Price: ${totalPrice}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" color="#333" sx={{ fontWeight: 500, mb: 1 }}>
                  Select Ticket Type:
                </Typography>
                <Select value={userCategory} onChange={handleUserCategoryChange} sx={{ minWidth: 200 }}>
                  <MenuItem value="foreigner">Foreigner</MenuItem>
                  <MenuItem value="native">Native</MenuItem>
                  <MenuItem value="student">Student</MenuItem>
                </Select>
              </Box>
            </CardContent>

            <Dialog
              open={shareOpen}
              onClose={handleShareToggle}
              TransitionComponent={Slide}
              TransitionProps={{ direction: "up" }}
              sx={{
                "& .MuiPaper-root": {
                  borderRadius: "16px", // Rounded corners
                  padding: 4, // Added padding
                  backgroundColor: "#F7F9FC", // Light background color
                  width: "80%", // Larger dialog width
                  maxWidth: 600, // Maximum width
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                {/* Close Button */}
                <IconButton onClick={handleShareToggle} sx={{ position: "absolute", top: 16, right: 16, color: "#E53E3E" }}>
                  <CloseIcon />
                </IconButton>

                {/* Title */}
                <Typography variant="h6" color="#2D3748" textAlign="center" sx={{ mt: 3, fontWeight: "bold", fontSize: "1.2rem" }}>
                  Share this Itinerary
                </Typography>

                {/* Icon Buttons */}
                <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 4, mb: 2 }}>
                  {/* Copy Link Button */}
                  <IconButton onClick={handleCopyLink} sx={{ backgroundColor: "#38B2AC", padding: 2, borderRadius: "8px", "&:hover": { backgroundColor: "#319795" } }}>
                    <LinkIcon sx={{ color: "#FFFFFF", fontSize: "2rem" }} /> {/* Increased icon size */}
                  </IconButton>

                  {/* Email Share Button */}
                  <IconButton onClick={handleEmailShare} sx={{ backgroundColor: "#5A67D8", padding: 2, borderRadius: "8px", "&:hover": { backgroundColor: "#4C51BF" } }}>
                    <EmailIcon sx={{ color: "#FFFFFF", fontSize: "2rem" }} /> {/* Increased icon size */}
                  </IconButton>
                </Box>
              </Box>
            </Dialog>

            <CardActions sx={{ justifyContent: "space-between", padding: "24px 32px" }}>
              {userType === "Tourist" && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={handleDecrease} disabled={ticketCount === 1}>
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ mx: 1 }}>
                    {ticketCount}
                  </Typography>
                  <IconButton onClick={handleIncrease}>
                    <AddIcon />
                  </IconButton>
                  <Button variant="contained" color="primary" onClick={BookPlace} sx={{ fontSize: "1rem", fontWeight: 500, ml: 2 }}>
                    Book Place
                  </Button>
                </Box>
              )}
              <Button variant="outlined" onClick={() => setShareOpen(!shareOpen)} startIcon={<ShareIcon />} sx={{ fontSize: "1rem", fontWeight: 500 }}>
                Share
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Reviews Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ width: "100%", borderRadius: 3, boxShadow: 5, padding: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Reviews
              </Typography>
              <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                {reviews.map((review) => (
                  <Paper
                    key={review._id}
                    sx={{
                      mb: 2,
                      padding: 2,
                      backgroundColor: "#f9f9f9",
                      borderRadius: 2,
                      boxShadow: 1,
                      position: "relative",
                      "&:hover": {
                        boxShadow: 3,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#333" }}>
                        {review.tourist.username}
                      </Typography>
                      <Rating value={review.rating} precision={0.5} readOnly sx={{ ml: 1 }} />
                    </Box>
                    <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
                      {review.comment}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlaceDetails;
