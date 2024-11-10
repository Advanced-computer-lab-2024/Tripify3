import React, { useEffect, useState } from "react";
import { Box, Paper, Dialog, Slide, Rating, CardActions, Typography, Button, CircularProgress, Grid, Card, CardContent, Avatar, List, ListItem } from "@mui/material";
import { getItineraryById, getUserProfile } from "../../services/tourist";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Favorite } from "@mui/icons-material";
import { Close as CloseIcon, Link as LinkIcon, Email as EmailIcon } from "@mui/icons-material";
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { getUserId } from "../../utils/authUtils";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { useParams, useNavigate } from "react-router-dom";

const TourGuideItineraryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = getUserId();
  const [itinerary, setItinerary] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [currency, setCurrency] = useState("USD"); // Default currency

  // Fetch itinerary and user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency); // Set user's selected currency
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile(); // Fetch currency when the component mounts

    const fetchItinerary = async () => {
      try {
        const response = await getItineraryById(id);
        setItinerary(response.data.data.itinerary);
        setReview(response.data.data);
        setLoading(false);
        await fetchTourGuideProfile(response.data.data.itinerary.tourGuide._id, userId);
      } catch (error) {
        setError("Error fetching Itinerary details");
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id, userId]);

  const fetchTourGuideProfile = async (tourGuideId, touristId) => {
    try {
      const response = await axios.get(`http://localhost:8000/booking/get/tour-guide/profile/${tourGuideId}/${touristId}`);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error fetching tour guide profile:", error);
    }
  };

  const handleShareToggle = () => {
    setShareOpen((prev) => !prev);
  };

  const handleCopyLink = () => {
    const link = `http://localhost:3000/tourist/itinerary/${itinerary._id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
      setShareOpen(false);
    });
  };

  const handleEmailShare = () => {
    const emailSubject = `Check out this itinerary: ${itinerary.name}`;
    const emailBody =
      `I thought you might be interested in this itinerary!\n\n` +
      `Itinerary Name: ${itinerary.name}\n` +
      `Location: ${itinerary.location}\n` +
      `Date: From ${new Date(itinerary.timeline.startTime).toLocaleDateString()} to ${new Date(itinerary.timeline.endTime).toLocaleDateString()} ` +
      `Tour Guide: ${itinerary.tourGuide.name} (Rating: ${itinerary.tourGuide.rating}/5)\n` +
      `Contact: ${itinerary.tourGuide.email}\n` +
      `Phone: ${itinerary.tourGuide.phoneNumber}\n\n` +
      `Pickup Location: ${itinerary.pickupLocation}\n` +
      `Drop-off Location: ${itinerary.dropoffLocation}\n\n` +
      `Available Dates:\n` +
      `Price: ${itinerary.price} ${currency}\n` +
      `Status: ${itinerary.status}\n\n` +
      `View more details here: http://localhost:3000/tourist/itinerary/${itinerary._id}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(gmailUrl, "_blank");
  };

  // Loading and Error Handling States
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

  // Function to format currency
  const exchangeRates = {
    USD: 0.02, // 1 EGP = 0.05 USD
    EUR: 0.07, // 1 EGP = 0.045 EUR
    GBP: 0.038, // 1 EGP = 0.038 GBP
    AUD: 0.07, // 1 EGP = 0.07 AUD
    CAD: 0.065, // 1 EGP = 0.065 CAD
    // Add other currencies as needed
  };

  const formatCurrency = (amount) => {
    if (!currency) {
      return amount; // Fallback to amount if currency is not set
    }

    // Ensure amount is a number
    const value = Number(amount);

    // Convert amount from EGP to chosen currency if currency is EGP
    const convertedAmount = currency === "EGP" ? value : value * exchangeRates[currency];

    return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(convertedAmount);
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#F5F7FA",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ position: "absolute", top: 16, left: 16, fontSize: "1rem", fontWeight: 500 }}>
        Go Back
      </Button>

      <Box sx={{ display: "flex", justifyContent: "space-between", p: 4 }}>
        {/* Left: Itinerary Card */}
        <Box sx={{ flex: 1, maxWidth: "900px" }}>
          <Card sx={{ mt: 6, width: "100%", borderRadius: 3, boxShadow: 5, padding: 4, minHeight: "500px" }}>
            <CardContent>
              {/* Main Itinerary Header */}
              <Typography variant="h4" textAlign="center">
                {itinerary.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" textAlign="center">
                Language: {itinerary.language}
              </Typography>

              {/* Tags Section */}
              <Box sx={{ textAlign: "center", mb: 6 }}>
                {itinerary.tags && itinerary.tags.length > 0 ? (
                  <Box sx={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center" }}>
                    {itinerary.tags.map((tag, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#E2E8F0",
                          borderRadius: "12px",
                          padding: "6px 12px",
                          margin: "4px",
                          fontSize: "0.875rem",
                          color: "#2D3748",
                        }}
                      >
                        <Typography variant="body2">{tag.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No tags available.
                  </Typography>
                )}
              </Box>

              {/* Itinerary Summary Section */}
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <LocationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                    <Typography variant="body1">Drop-off Location: {itinerary.dropoffLocation}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <EventNoteIcon sx={{ color: "#5A67D8", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>Start Date:</strong> {new Date(itinerary.timeline.startTime).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <EventNoteIcon sx={{ color: "#5A67D8", mr: 1 }} />
                    <Typography variant="body1">
                      <strong>End Date:</strong> {new Date(itinerary.timeline.endTime).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center">
                    <MonetizationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                    <Typography variant="body1">{formatCurrency(itinerary.price)}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Activities Section */}
              <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                Activities
              </Typography>
              <Grid container spacing={3}>
                {itinerary.activities.map((activity) => (
                  <Grid item xs={12} sm={6} key={activity._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{activity.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Location: {activity.location}
                        </Typography>
                        <Typography variant="body2">Date: {new Date(activity.date).toLocaleDateString()}</Typography>
                        <Typography variant="body2">Duration: {activity.duration} minutes</Typography>
                        <Typography variant="body2">
                          Price: {formatCurrency(activity.price)} (Discount: {activity.specialDiscount}%)
                        </Typography>
                        <Typography variant="body2">Status: {activity.status}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Share Button */}
              <CardActions sx={{ padding: "24px 32px" }}>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleShareToggle}
                    startIcon={<ShareIcon />}
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  >
                    Share
                  </Button>
                </Box>
              </CardActions>

              {/* Share Dialog */}
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

              {/* Booking Actions */}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default TourGuideItineraryDetails;