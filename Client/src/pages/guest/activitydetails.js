import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Grid, Card, CardContent, CardActions, IconButton, Dialog, Slide } from "@mui/material";
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
import { getItineraryById, getUserProfile } from "../../services/tourist";
import { getActivityById } from "../../services/tourist";
import axios from "axios";
import { getUserId, getUserType, getUserCurrency } from "../../utils/authUtils";

const GuestActivityDetails = () => {
  const userCurrency = getUserCurrency();
  const { id } = useParams();
  const [currency, setCurrency] = useState("USD");
  const userId = getUserId();
  const userType = getUserType();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleIncrease = () => setTicketCount(ticketCount + 1);
  const handleDecrease = () => ticketCount > 1 && setTicketCount(ticketCount - 1);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency); // Set user's selected currency
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
    const fetchActivity = async () => {
      try {
        const response = await getActivityById(id);
        setActivity(response.data.data.activity);
        setTotalPrice(response.data.data.activity.price);
        setLoading(false);
      } catch (error) {
        setError("Error fetching activity details");
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id, userId]);

  useEffect(() => {
    // Recalculate total price whenever ticketCount changes
    if (activity) {
      setTotalPrice(ticketCount * activity.price);
    }
  }, [ticketCount, activity]);

  const handleShareToggle = () => setShareOpen(!shareOpen);

  const handleCopyLink = () => {
    const link = `http://localhost:3000/activity/${activity._id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
      setShareOpen(false);
    });
  };

  const BookActivity = async () => {
    const tourist = getUserId();
    const price = ticketCount * activity.price;
    const booking = { tourist, price, type: "Activity", itemId: activity._id, tickets: ticketCount };

    try {
      const response = await axios.post(`http://localhost:8000/tourist/booking/create`, booking);
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const exchangeRates = {
    USD: 1 / 49, // 1 EGP = 0.0204 USD (1 USD = 49 EGP)
    EUR: 1 / 52, // 1 EGP = 0.0192 EUR (1 EUR = 52 EGP)
    GBP: 1 / 63, // 1 EGP = 0.0159 GBP (1 GBP = 63 EGP)
    AUD: 1 / 32, // 1 EGP = 0.03125 AUD (1 AUD = 32 EGP)
    CAD: 1 / 35, // 1 EGP = 0.02857 CAD (1 CAD = 35 EGP)
    // Add other currencies as needed
  };

  const formatCurrency = (amount) => {
    if (!currency) {
      return amount; // Fallback to amount if currency is not set
    }
    const value = Number(amount);
    // Check user type and apply currency logic
    if (getUserType() !== "Tourist") {
      // If user is not Tourist, format amount in EGP
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(value);
    }

    // Convert amount from EGP to chosen currency if currency is EGP
    const convertedAmount = currency === "EGP" ? value : value * exchangeRates[currency];

    // return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
    //   .format(convertedAmount);

    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(convertedAmount);

    return formattedAmount.replace(/(\D)(\d)/, "$1 $2");
  };
  const handleEmailShare = () => {
    const emailSubject = `Check out this itinerary: ${activity.name}`;
    // Construct email body with additional itinerary details
    const emailBody =
      `I thought you might be interested in this activity!\n\n` +
      `Activity Name: ${activity.name}\n` +
      `Location: ${activity.location}\n` +
      `Total Price: EGP ${activity.price}\n` +
      `Date:  ${new Date(activity.date).toLocaleDateString()} ` +
      `Price: ${activity.price} \n` +
      `View more details here: http://localhost:3000/activity/${activity._id}`;

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
    <Box sx={{ p: 3, backgroundColor: "#F5F7FA", minHeight: "100vh", position: "relative" }}>
      <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ position: "absolute", top: 16, left: 16, fontSize: "1rem", fontWeight: 500 }}>
        Go Back
      </Button>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", mt: 5 }}>
        <Card sx={{ width: "100%", maxWidth: "900px", borderRadius: 3, boxShadow: 5, padding: 4, minHeight: "500px" }}>
          <CardContent>
            <Typography variant="h4" color="#333" gutterBottom textAlign="center" sx={{ mb: 3 }}>
              {activity.name}
            </Typography>

            {activity.specialDiscount > 0 && (
              <Box sx={{ backgroundColor: "#E2F0E6", color: "#2C7A7B", borderRadius: 2, padding: "12px", textAlign: "center", mb: 4, fontWeight: 600, fontSize: "1.15rem" }}>
                Special Discount: {activity.specialDiscount}%
              </Box>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                    {activity.location}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EventNoteIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                    {new Date(activity.date).toLocaleDateString()} at {activity.time}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTimeIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                    {activity.duration} minutes
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <MonetizationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                    {formatCurrency(activity.price)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} sx={{ color: index < activity.rating ? "#ECC94B" : "#E2E8F0", mr: 0.5 }} />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" color="#333" sx={{ mt: 2 }}>
                  Category: {activity.category.name}
                </Typography>
                <Typography variant="h6" color="#333" sx={{ mt: 1 }}>
                  Tags: {activity.tags.map((tag) => tag.name).join(", ")}
                </Typography>
              </Grid>
            </Grid>
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

                {/* Position total price next to ticket count */}
                <Typography variant="h6" color="#333" sx={{ mx: 2 }}>
                  Total Price: {formatCurrency(totalPrice)}
                </Typography>

                <Button variant="contained" color="primary" onClick={BookActivity} sx={{ fontSize: "1rem", fontWeight: 500 }}>
                  Book Activity
                </Button>
              </Box>
            )}

            <Button variant="outlined" onClick={handleShareToggle} startIcon={<ShareIcon />} sx={{ fontSize: "1rem" }}>
              Share
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
};

export default GuestActivityDetails;
