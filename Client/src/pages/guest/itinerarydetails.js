import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Dialog,
  Slide,
  Rating,
  CardActions,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
} from "@mui/material";
import { getItineraryById, getUserProfile } from "../../services/tourist";//////////////////////////////////
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Favorite } from "@mui/icons-material";
import { Close as CloseIcon, Link as LinkIcon, Email as EmailIcon } from "@mui/icons-material";
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { getUserId } from "../../utils/authUtils";///////////////////////
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { useParams, useNavigate } from "react-router-dom";////////////////////////
import { getUserType } from "../../utils/authUtils";

const GuestItineraryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();/////////
  const userId = getUserId();
  const [itinerary, setItinerary] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [currency, setCurrency] = useState("USD"); // Default currency///////////////

  // Function to handle ticket count increase
  const handleIncrease = () => setTicketCount((prev) => prev + 1);
  const handleDecrease = () => ticketCount > 1 && setTicketCount((prev) => prev - 1);

  // Fetch itinerary and user profile data
  useEffect(   () => {
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
        console.log(response.data);
        
        setLoading(false);
        await fetchTourGuideProfile(response.data.data.itinerary.tourGuide._id, userId);
      } catch (error) {
        setError("Error fetching Itinerary details");
        console.log(error);
        
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

  const handleFollowToggle = async () => {
    try {
      const followData = { follow: !isFollowing };
      await axios.post(`http://localhost:8000/tourist/follow/${userId}/${itinerary.tourGuide._id}`, followData);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const BookItinerary = async () => {
    const tourist = getUserId();
    const price = ticketCount * itinerary.price; // Calculate total price
    const type = "Itinerary";
    const itemId = itinerary._id;
    const booking = { tourist, price, type, itemId, tickets: ticketCount };
    try {
      const response = await axios.post(`http://localhost:8000/tourist/booking/create`, booking);
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending message:", error);
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
    const emailBody = `I thought you might be interested in this itinerary!\n\n` +
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
    window.open(gmailUrl, '_blank');
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

  const exchangeRates = {
    USD: 1 / 49,  // 1 EGP = 0.0204 USD (1 USD = 49 EGP)
    EUR: 1 / 52,  // 1 EGP = 0.0192 EUR (1 EUR = 52 EGP)
    GBP: 1 / 63,  // 1 EGP = 0.0159 GBP (1 GBP = 63 EGP)
    AUD: 1 / 32,  // 1 EGP = 0.03125 AUD (1 AUD = 32 EGP)
    CAD: 1 / 35,  // 1 EGP = 0.02857 CAD (1 CAD = 35 EGP)
    // Add other currencies as needed
};

  const formatCurrency = (amount) => {
    if (!currency) {
      return amount; // Fallback to amount if currency is not set
    }
    // Ensure amount is a number
    const value = Number(amount);
  
      // Check user type and apply currency logic
  if (getUserType() !== "Tourist") {
    // If user is not Tourist, format amount in EGP
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'EGP' 
    }).format(value);
  }

    // Convert amount from EGP to chosen currency if currency is EGP
    const convertedAmount = (currency === "EGP") ? value : value * ( exchangeRates[currency]);
  
    // return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
    //   .format(convertedAmount);
    
      const formattedAmount = new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currency 
      }).format(convertedAmount);
      
      return formattedAmount.replace(/(\D)(\d)/, '$1 $2');
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "#F5F7FA", minHeight: "100vh", position: "relative" }}>
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
                        <Typography variant="body2">
                          Date: {new Date(activity.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          Duration: {activity.duration} minutes
                        </Typography>
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
              <CardActions sx={{ padding: "24px 32px" }}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={BookItinerary}
                    sx={{
                      fontSize: "1rem",
                      fontWeight: 500,
                      textTransform: "none",
                      whiteSpace: "nowrap", // Prevents text from wrapping
                      width: "100%", // Ensures the button stretches across the full container width
                      "&:hover": {
                        backgroundColor: "#4c73d1",
                      },
                    }}
                  >
                    Book Itinerary
                  </Button>
                </Grid>

                <Grid container spacing={20} alignItems="center">
                  <Grid item>
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
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      Total Price: {formatCurrency(ticketCount * itinerary.price)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardActions>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card sx={{ mt: 9, width: "100%", borderRadius: 3, boxShadow: 5, padding: 4 }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Reviews
              </Typography>

              <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                {review.reviews.map((review) => (
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
                    <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                      <Rating value={review.rating} readOnly precision={0.5} size="small" />
                    </Box>

                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      @{review.tourist.username}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {review.comment}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right: Comments & Tour Guide */}
        <Box sx={{ flex: 1, maxWidth: "600px" }}>
          <Card sx={{ mt: 6, borderRadius: 3, boxShadow: 5, padding: 4 }}>
            <CardContent>
              <Box sx={{ textAlign: "center" }}>
              <Avatar src={`http://localhost:8000/uploads/${itinerary.tourGuide._id}/${itinerary.tourGuide.profilePicture?.filename}`} sx={{ width: 150, height: 150, mb: 2, mx: "auto" }}>
                    {/* If profile picture URL is missing or fails to load, show the initial */}
                    {!itinerary.tourGuide.profilePicture && itinerary.tourGuide.name.charAt(0)}
                  </Avatar>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {itinerary.tourGuide.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {itinerary.tourGuide.yearsOfExperience} years of experience
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  ✨ {itinerary.tourGuide.previousWork.join(", ")}
                </Typography>
                <Button
                  variant="contained"
                  color={isFollowing ? "secondary" : "primary"}
                  sx={{ mb: 2 }}
                  onClick={handleFollowToggle}
                  startIcon={<Favorite />}
                >
                  {isFollowing ? "Following" : "Follow"} {isFollowing ? "💖" : "💬"}
                </Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">📞 {itinerary.tourGuide.phoneNumber}</Typography>
                <Typography variant="body2">📧 {itinerary.tourGuide.email}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default GuestItineraryDetails;