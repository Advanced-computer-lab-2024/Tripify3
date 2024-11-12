import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  Divider,
  CardContent,
  Paper,
  CardActions,
  IconButton,
  Avatar,
  TextField,
  Dialog,
  Slide,
  Rating,
  Grid,
  List,
  ListItem,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Favorite, Star } from "@mui/icons-material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { getUserId, getUserType } from "../../utils/authUtils";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { getUserProfile } from "../../services/tourist";

// API functions to fetch Activity and Itinerary details
export const getActivityById = async (id) => {
  const response = await axios.get(`http://localhost:8000/activity/get/${id}`);
  return response;
};

export const getItineraryById = async (id) => {
  const response = await axios.get(`http://localhost:8000/itinerary/get/${id}`);
  return response;
};

const BookingDetails = () => {
  const { itemId, type, view, bookingId } = useParams();
  const userId = getUserId();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [review, setReview] = useState(null);
  const [tourGuideReview, setTourGuideReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [tourGuideComment, setTourGuideComment] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [currency, setCurrency] = useState("USD");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [dialogMessage, setDialogMessage] = React.useState("");
  const [initialRating, setInitialRating] = useState(0);
  const [initialComment, setInitialComment] = useState("");
  const [initialTourGuideRating, setInitialTourGuideRating] = useState(0);
  const [initialTourGuideComment, setInitialTourGuideComment] = useState("");
  const [isEditable, setIsEditable] = useState(initialTourGuideComment === "");
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

  useEffect(() => {
    if (initialTourGuideRating !== 0 && booking !== null) {
      handleTourGuideFeedback();
    }
  }, [initialTourGuideRating]);

  const handleCancelBooking = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/booking/delete/${bookingId}`);

      if (response.status === 200) {
        setDialogMessage("Booking has been cancelled. Your payment will be refunded.");
      } else {
        setDialogMessage("Cannot cancel booking within 48 hours of the start date.");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setDialogMessage("Cannot cancel booking within 48 hours of the start date.");
      } else {
        setDialogMessage("An error occurred while trying to cancel the booking.");
      }
    }
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    if (dialogMessage.includes("cancelled")) {
      navigate(-1); // Go back to the previous page
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency); // Set user's selected currency
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    const fetchBooking = async () => {
      try {
        let bookingData;
        let response;

        if (view === "past") {
          if (type === "Activity") {
            response = await axios.get(`http://localhost:8000/booking/get/reviews/${bookingId}/${userId}/activity/${itemId}`);
          } else if (type === "Itinerary") {
            response = await axios.get(`http://localhost:8000/booking/get/reviews/${bookingId}/${userId}/itinerary/${itemId}`);
          }

          if (response.data.message === "Review found successfully") {
            const { rating, comment } = response.data.review;

            setReview(response.data.review);
            setRating(rating);
            setComment(comment);
            setInitialRating(rating);
            setInitialComment(comment);
          }
          if (response.data.tourGuideReview) {
            setTourGuideReview(response.data.tourGuideReview);
            setInitialTourGuideRating(response.data.tourGuideReview.rating);
            setInitialTourGuideComment(response.data.tourGuideReview.comment);
            setIsEditable(false);
          }
        }
        if (type === "Activity") {
          const activityResponse = await getActivityById(itemId);
          setReview(activityResponse.data.data);
          bookingData = activityResponse.data.data.activity;
        } else if (type === "Itinerary") {
          const itineraryResponse = await getItineraryById(itemId);
          bookingData = itineraryResponse.data.data.itinerary;
          setReview(itineraryResponse.data.data);
          await fetchTourGuideProfile(bookingData.tourGuide._id, userId);
        }
        setBooking(bookingData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Error fetching booking details");
        setLoading(false);
      }
    };

    const fetchTourGuideProfile = async (tourGuideId, touristId) => {
      try {
        const response = await axios.get(`http://localhost:8000/booking/get/tour-guide/profile/${tourGuideId}/${touristId}`);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error fetching tour guide profile:", error);
      }
    };

    fetchBooking();
    fetchUserProfile();
  }, [itemId, type, userId, bookingId]);

  const handleFollowToggle = async () => {
    try {
      const followData = { follow: !isFollowing };
      await axios.post(`http://localhost:8000/tourist/follow/${userId}/${booking.tourGuide._id}`, followData);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const handleRatingChange = async (newRating) => {
    setRating(newRating);

    if (newRating !== initialRating) {
      try {
        await handleItemFeedback(newRating, comment || "");

        setInitialRating(newRating);
      } catch (error) {
        console.error("Error updating rating:", error);
      }
    }
  };

  const handleTourGuideRatingChange = async (newRating) => {
    setRating(newRating);

    if (newRating !== initialRating) {
      try {
        await handleItemFeedback(newRating, comment || "");

        setInitialTourGuideRating(newRating);
      } catch (error) {
        console.error("Error updating rating:", error);
      }
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = async () => {
    if (comment !== initialComment) {
      try {
        await handleItemFeedback(initialRating, comment);
        setInitialComment(comment);
        setFeedbackSubmitted(true);
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  const handleTourGuideAddComment = async () => {
    if (comment !== initialComment) {
      try {
        await handleItemFeedback(initialRating, comment);
        setInitialTourGuideComment(comment);
        setFeedbackSubmitted(true);
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

  const handleItemFeedback = async (rating, comment) => {
    const feedbackData = {
      tourist: userId,
      rating,
      comment,
      booking: bookingId,
    };

    if (type === "Activity") {
      feedbackData.activity = itemId;
    } else if (type === "Itinerary") {
      feedbackData.itinerary = itemId;
    }

    try {
      await axios.post("http://localhost:8000/tourist/review", feedbackData);
      setFeedbackSubmitted(true);
      setComment("");
      if (comment != "") {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting itinerary feedback:", error);
    }
  };

  const handleTourGuideFeedback = async () => {
    const feedbackData = {
      tourist: userId,
      rating: initialTourGuideRating,
      comment: initialTourGuideComment,
      tourGuide: booking.tourGuide._id,
      booking: bookingId,
    };

    try {
      await axios.post("http://localhost:8000/tourist/review", feedbackData);
      setFeedbackSubmitted(true);
    } catch (error) {
      console.error("Error submitting tour guide feedback:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  if (type === "Itinerary") {
    return (
      <Box sx={{ p: 3, backgroundColor: "#F5F7FA", minHeight: "100vh", position: "relative" }}>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ position: "absolute", top: 16, left: 16, fontSize: "1rem", fontWeight: 500 }}>
          Go Back
        </Button>

        <Box sx={{ display: "flex", justifyContent: "space-between", p: 4 }}>
          {/* Left: Itinerary Card */}
          <Box sx={{ flex: 1, maxWidth: "900px" }}>
            <Card sx={{ width: "100%", borderRadius: 3, boxShadow: 5, padding: 4, minHeight: "500px" }}>
              <CardContent>
                {/* Main Itinerary Header */}
                <Typography variant="h4" textAlign="center">
                  {booking.name}
                </Typography>
                {/* Cancel Booking Button */}
                {view === "upcoming" && (
                  <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={handleCancelBooking}>
                    Cancel Booking
                  </Button>
                )}

                <Typography variant="body2" color="textSecondary" textAlign="center">
                  Language: {booking.language}
                </Typography>

                {/* Tags Section */}
                <Box sx={{ textAlign: "center", mb: 6 }}>
                  {booking.tags && booking.tags.length > 0 ? (
                    <Box sx={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center" }}>
                      {booking.tags.map((tag, index) => (
                        <Box
                          key={index}
                          sx={{ display: "flex", alignItems: "center", backgroundColor: "#E2E8F0", borderRadius: "12px", padding: "6px 12px", margin: "4px", fontSize: "0.875rem", color: "#2D3748" }}
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

                {/* Booking Summary Section */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <LocationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                      <Typography variant="body1">Drop-off Location: {booking.dropoffLocation}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <EventNoteIcon sx={{ color: "#5A67D8", mr: 1 }} />
                      <Typography variant="body1">
                        <strong>Start Date:</strong> {new Date(booking.timeline.startTime).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <EventNoteIcon sx={{ color: "#5A67D8", mr: 1 }} />
                      <Typography variant="body1">
                        <strong>End Date:</strong> {new Date(booking.timeline.endTime).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center">
                      <MonetizationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                      <Typography variant="body1">    {formatCurrency(booking.price)}
                         {/* ${booking.price} */}
                         </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Activities Section */}
                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                  Activities
                </Typography>
                <Grid container spacing={3}>
                  {booking.activities.map((activity) => (
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
                            Price: ${activity.price} (Discount: {activity.specialDiscount}%)
                          </Typography>
                          <Typography variant="body2">Status: {activity.status}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Rating & Comment Fields */}
                {view === "past" && (
                  <>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Rate This Itinerary
                    </Typography>
                    <Rating value={rating} onChange={(event, newValue) => handleRatingChange(newValue)} size="large" />
                    {rating > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <TextField fullWidth label="Your Comment" value={comment} onChange={handleCommentChange} multiline rows={4} />
                        {comment && (
                          <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddComment}>
                            Add Comment
                          </Button>
                        )}
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
            <Dialog open={openDialog} onClose={handleDialogClose}>
              <DialogTitle>Booking Status</DialogTitle>
              <DialogContent>
                <DialogContentText>{dialogMessage}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                  OK
                </Button>
              </DialogActions>
            </Dialog>

            <Card sx={{ mt: 9, width: "100%", borderRadius: 3, boxShadow: 5, padding: 4 }}>
              <CardContent>
                {/* Title */}
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                  Reviews
                </Typography>

                {/* Comments Container */}
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                  {/* Scrollable Area */}
                  {review.reviews.map((review) => (
                    <Paper
                      key={review._id}
                      sx={{
                        mb: 2,
                        padding: 2,
                        backgroundColor: "#f9f9f9",
                        borderRadius: 2,
                        boxShadow: 1,
                        position: "relative", // Positioning for the rating stars
                        "&:hover": {
                          boxShadow: 3, // Slight hover effect for interactivity
                        },
                      }}
                    >
                      {/* Rating at top right */}
                      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
                        <Rating value={review.rating} readOnly precision={1} size="small" />
                      </Box>

                      {/* Comment and Username */}
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
            {/* Tour Guide Profile */}
            <Card sx={{ borderRadius: 3, boxShadow: 5, padding: 4 }}>
              <CardContent>
                <Box sx={{ textAlign: "center" }}>
                  <Avatar src={`http://localhost:8000/uploads/${booking.tourGuide._id}/${booking.tourGuide.profilePicture?.filename}`} sx={{ width: 150, height: 150, mb: 2, mx: "auto" }}>
                    {/* If profile picture URL is missing or fails to load, show the initial */}
                    {!booking.tourGuide.profilePicture && booking.tourGuide.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {booking.tourGuide.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {booking.tourGuide.yearsOfExperience} years of experience
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    ✨ {booking.tourGuide.previousWork.join(", ")}
                  </Typography>
                  <Button variant="contained" color={isFollowing ? "secondary" : "primary"} sx={{ mb: 2 }} onClick={handleFollowToggle} startIcon={<Favorite />}>
                    {isFollowing ? "Following" : "Follow"} {isFollowing ? "💖" : "💬"}
                  </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">📞 {booking.tourGuide.phoneNumber}</Typography>
                  <Typography variant="body2">📧 {booking.tourGuide.email}</Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {view === "past" && (
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Rate This Tour Guide 🌟
                    </Typography>
                    <Rating value={initialTourGuideRating} onChange={(event, newValue) => setInitialTourGuideRating(newValue)} precision={1} size="large" sx={{ mb: 2 }} />
                    <TextField
                      label="Your Comment"
                      fullWidth
                      multiline
                      rows={4}
                      value={initialTourGuideComment}
                      onChange={(e) => setInitialTourGuideComment(e.target.value)}
                      variant="outlined"
                      sx={{ mb: 2 }}
                      InputProps={{
                        readOnly: initialTourGuideComment !== "" && !isEditable, // Make read-only if there is an initial comment and edit mode is off
                      }}
                    />

                    {initialTourGuideComment === "" || isEditable ? (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ padding: "10px 20px", mt: 1 }}
                        onClick={() => {
                          handleTourGuideFeedback();
                          setIsEditable(false); // Set back to non-editable after submitting
                        }}
                      >
                        Add Comment 📝
                      </Button>
                    ) : (
                      <Button
                        variant="text"
                        color="primary"
                        sx={{ ml: 1 }}
                        onClick={() => setIsEditable(true)} // Enable edit mode
                      >
                        Edit
                      </Button>
                    )}
                    {feedbackSubmitted && (
                      <Typography variant="body2" color="success.main">
                        Thank you for your feedback!
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    );
  } else if (type === "Activity") {
    return (
      <Box sx={{ p: 3, backgroundColor: "#F5F7FA", minHeight: "100vh", position: "relative" }}>
        <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ position: "absolute", top: 16, left: 16, fontSize: "1rem", fontWeight: 500 }}>
          Go Back
        </Button>

        <Box sx={{ display: "flex", justifyContent: "space-between", p: 4 }}>
          {/* Left: Itinerary Card */}
          <Box sx={{ mt: 7, flex: 1, maxWidth: "900px" }}>
            <Card sx={{ width: "100%", borderRadius: 3, boxShadow: 5, padding: 4, minHeight: "500px" }}>
              <CardContent>
                {/* Main Itinerary Header */}
                <Typography variant="h4" color="#333" gutterBottom textAlign="center" sx={{ mb: 3 }}>
                  {booking.name}
                </Typography>

                {booking.specialDiscount > 0 && (
                  <Box
                    sx={{
                      backgroundColor: "#E2F0E6",
                      color: "#2C7A7B",
                      borderRadius: 2,
                      padding: "12px",
                      textAlign: "center",
                      mb: 4,
                      fontWeight: 600,
                      fontSize: "1.15rem",
                    }}
                  >
                    Special Discount: {booking.specialDiscount}%
                  </Box>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <LocationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                      <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                        {booking.location}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <EventNoteIcon sx={{ color: "#5A67D8", mr: 1 }} />
                      <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <AccessTimeIcon sx={{ color: "#5A67D8", mr: 1 }} />
                      <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                        {booking.duration} minutes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <MonetizationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                      <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                        {formatCurrency(booking.price)}
                        {/* {booking.price} */}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <StarIcon
                          key={index}
                          sx={{
                            color: index < booking.rating ? "#ECC94B" : "#E2E8F0",
                            mr: 0.5,
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" color="#333" sx={{ mt: 2 }}>
                      Category: {booking.category.name}
                    </Typography>
                    <Typography variant="h6" color="#333" sx={{ mt: 1 }}>
                      Tags: {booking.tags.map((tag) => tag.name).join(", ")}
                    </Typography>
                  </Grid>
                </Grid>

                {view === "upcoming" && (
                  <Button variant="contained" color="error" sx={{ mt: 2 }} onClick={handleCancelBooking}>
                    Cancel Booking
                  </Button>
                )}

                {view === "past" && (
                  <>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Rate This Itinerary
                    </Typography>
                    <Rating value={rating} onChange={(event, newValue) => handleRatingChange(newValue)} size="large" />
                    {rating > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <TextField fullWidth label="Your Comment" value={comment} onChange={handleCommentChange} multiline rows={4} />
                        {comment && (
                          <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddComment}>
                            Add Comment
                          </Button>
                        )}
                      </Box>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
            <Dialog open={openDialog} onClose={handleDialogClose}>
              <DialogTitle>Booking Status</DialogTitle>
              <DialogContent>
                <DialogContentText>{dialogMessage}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </Box>

          {/* Right: Comments & Tour Guide */}
          <Box sx={{ flex: 1, maxWidth: "600px" }}>
            {/* Tour Guide Profile */}
            <Card sx={{ mt: 7, width: "100%", borderRadius: 3, boxShadow: 5, padding: 4 }}>
              <CardContent>
                {/* Title */}
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                  Reviews
                </Typography>

                {/* Comments Container */}
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
                        <Rating value={review.rating} readOnly precision={1} size="small" />
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
        </Box>
      </Box>
    );
  } else if (type === "Hotel") {
  }
};

export default BookingDetails;
