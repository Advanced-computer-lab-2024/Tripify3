import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Card, Divider, CardContent, Paper, CardActions, IconButton, Avatar, TextField, Dialog, Slide, Rating, Grid, List, ListItem } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Favorite, Star } from "@mui/icons-material";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";

import axios from "axios";
import { getUserId } from "../../utils/authUtils";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

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
  const { itemId, type, view } = useParams();
  const userId = getUserId();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [tourGuideRating, setTourGuideRating] = useState(0);
  const [tourGuideComment, setTourGuideComment] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        let bookingData;

        if (type === "Activity") {
          const activityResponse = await getActivityById(itemId);
          setReview(activityResponse.data.data);
          bookingData = activityResponse.data.data.activity;
        } else if (type === "Itinerary") {
          const itineraryResponse = await getItineraryById(itemId);
          bookingData = itineraryResponse.data.data.itinerary;
          console.log(bookingData);
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
  }, [itemId, type, userId]);

  const handleFollowToggle = async () => {
    try {
      const followData = { follow: !isFollowing };
      await axios.post(`http://localhost:8000/tourist/follow/${userId}/${booking.tourGuide._id}`, followData);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const handleItemFeedback = async () => {
    const feedbackData = {
      tourist: userId, // Replace with actual tourist ID
      rating,
      comment,
    };

    if (type === "Activity") {
      feedbackData.activity = itemId;
    } else if (type === "Itinerary") {
      feedbackData.itinerary = itemId;
    }

    try {
      await axios.post("http://localhost:8000/tourist/review", feedbackData);
      setFeedbackSubmitted(true);
      setRating(0);
      setComment("");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting itinerary feedback:", error);
    }
  };

  const handleTourGuideFeedback = async () => {
    const feedbackData = {
      tourist: userId,
      tourGuideRatingating,
      tourGuideComment,
      tourGuide: booking.tourGuide._id,
    };

    try {
      await axios.post("http://localhost:8000/tourist/review", feedbackData);
      setFeedbackSubmitted(true);
      setTourGuideRating(0);
      setTourGuideComment("");
    } catch (error) {
      console.error("Error submitting tour guide feedback:", error);
    }
  };
  const handleShareToggle = () => {
    setShareOpen(!shareOpen);
  };

  const handleCopyLink = () => {
    const link = `http://localhost:3000/tourist/booking/${booking._id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
      setShareOpen(false);
    });
  };

  const handleEmailShare = () => {
    // Implement email sharing logic if needed
    alert("Email share functionality not implemented yet.");
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
                      <Typography variant="body1">Total Price: ${booking.price}</Typography>
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

                    <Box sx={{ mb: 2 }}>
                      <Rating
                        value={rating}
                        onChange={(event, newValue) => setRating(newValue)} // Update the rating
                        size="large" // Increase the size of stars
                      />
                    </Box>

                    <TextField fullWidth label="Your Comment" value={comment} onChange={(e) => setComment(e.target.value)} multiline rows={4} sx={{ mt: 2 }} />

                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleItemFeedback}>
                      Submit Feedback
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

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
                        <Rating value={review.rating} readOnly precision={0.5} size="small" />
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
                  <Avatar src={`http://localhost:8000/uploads/${booking.tourGuide._id}/${booking.tourGuide.profilePicture.filename}`} sx={{ width: 150, height: 150, mb: 2, mx: "auto" }} />
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
                    <Rating value={tourGuideRating} onChange={(event, newValue) => setTourGuideRating(newValue)} precision={0.5} size="large" sx={{ mb: 2 }} />
                    <TextField label="Your Comment" fullWidth multiline rows={4} value={tourGuideComment} onChange={(e) => setTourGuideComment(e.target.value)} variant="outlined" sx={{ mb: 2 }} />
                    <Button variant="contained" color="primary" sx={{ padding: "10px 20px" }} onClick={handleTourGuideFeedback}>
                      Submit Feedback 📝
                    </Button>
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
                        {booking.price}
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

                {view === "past" && (
                  <>
                    {/* Rating & Comment Fields */}
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Rate This Itinerary
                    </Typography>

                    {/* Star Rating Component */}
                    <Box sx={{ mb: 2 }}>
                      <Rating value={rating} onChange={(event, newValue) => setRating(newValue)} size="large" />
                    </Box>

                    {/* Comment Field */}
                    <TextField fullWidth label="Your Comment" value={comment} onChange={(e) => setComment(e.target.value)} multiline rows={4} sx={{ mt: 2 }} />

                    {/* Submit Button */}
                    <Button variant="contained" sx={{ mt: 2 }} onClick={handleItemFeedback}>
                      Submit Feedback
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Right: Comments & Tour Guide */}
          <Box sx={{ flex: 1, maxWidth: "600px", }}>
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
        </Box>
      </Box>
    );
  } else if (type === "Hotel") {
  } else if (type === "Flight") {
  }
};

export default BookingDetails;
