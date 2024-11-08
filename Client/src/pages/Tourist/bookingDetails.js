import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Avatar,
  TextField,
  Dialog,
  Slide,
  Rating,
  Grid,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { getUserId } from "../../utils/authUtils";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";


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
  const { itemId, type } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [tourGuide, setTourGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1); // Assuming ticket count for booking

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        let bookingData;
        if (type === "Activity") {
          const activityResponse = await getActivityById(itemId);
          bookingData = activityResponse.data.data;
        } else if (type === "Itinerary") {
          const itineraryResponse = await getItineraryById(itemId);
          bookingData = itineraryResponse.data.data;

          if (bookingData.tourGuide) {
            fetchTourGuideProfile(bookingData.tourGuide);
          }
        }

        setBooking(bookingData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError("Error fetching booking details");
        setLoading(false);
      }
    };

    const fetchTourGuideProfile = async (tourGuideId) => {
      const touristId = getUserId();
      try {
        const response = await axios.get(
          `http://localhost:8000/booking/get/tour-guide/profile/${tourGuideId}/${touristId}`
        );
        setTourGuide(response.data.tourGuide);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error fetching tour guide profile:", error);
      }
    };

    fetchBooking();
  }, [itemId, type]);

  const toggleFollow = async () => {
    const touristId = getUserId();
    try {
      await axios.post(`http://localhost:8000/tourist/follow/${touristId}/${tourGuide._id}`);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error following tour guide:", error);
    }
  };

  const handleReviewSubmit = async () => {
    const touristId = getUserId();
    try {
      await axios.post("http://localhost:8000/tourist/review", {
        touristId,
        tourGuideId: tourGuide._id,
        itineraryId: booking._id, // Assuming booking._id is itineraryId if type is Itinerary
        activityId: type === "Activity" ? booking._id : undefined, // Set activityId only if type is Activity
        rating,
        comment,
      });
      alert("Review submitted successfully!");
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
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

  const handleIncrease = () => {
    setTicketCount(ticketCount + 1);
  };

  const handleDecrease = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };

  const BookActivity = () => {
    // Implement booking logic
    alert(`Booked ${ticketCount} ${type}(s) successfully!`);
    navigate("/tourist/bookings");
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

  return (
    <Box sx={{ p: 3, backgroundColor: "#F5F7FA", minHeight: "100vh", position: "relative" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/tourist/bookings")}
        sx={{ position: "absolute", top: 16, left: 16, fontSize: "1rem", fontWeight: 500 }}
      >
        Back to Bookings
      </Button>

      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", mt: 5 }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: "900px",
            borderRadius: 3,
            boxShadow: 5,
            padding: 4,
            backgroundColor: "#fff",
          }}
        >
          <CardContent>
            <Typography variant="h4" color="#333" gutterBottom textAlign="center" sx={{ mb: 3 }}>
              {booking.name}
            </Typography>

            {type === "Activity" && booking.specialDiscount > 0 && (
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

            {type === "Itinerary" && booking.specialDiscount > 0 && (
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
              {/* Common Fields */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                    {booking.location || booking.pickupLocation}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EventNoteIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                    {new Date(booking.date || booking.timeline.startTime).toLocaleDateString()} at{" "}
                    {booking.time || new Date(booking.timeline.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccessTimeIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                    {booking.duration} {type === "Activity" ? "minutes" : "days"}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <MonetizationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                    ${booking.price}
                  </Typography>
                </Box>
              </Grid>

              {/* Specific Fields */}
              {type === "Activity" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <StarIcon sx={{ color: "#5A67D8", mr: 1 }} />
                      <Typography variant="body1" sx={{ color: "#4A5568", fontWeight: 500 }}>
                        {booking.rating} / 5
                      </Typography>
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
                </>
              )}

              {type === "Itinerary" && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="#333" sx={{ mt: 2 }}>
                      Language: {booking.language}
                    </Typography>
                    <Typography variant="h6" color="#333" sx={{ mt: 1 }}>
                      Pickup Location: {booking.pickupLocation}
                    </Typography>
                    <Typography variant="h6" color="#333" sx={{ mt: 1 }}>
                      Dropoff Location: {booking.dropoffLocation}
                    </Typography>
                    <Typography variant="h6" color="#333" sx={{ mt: 1 }}>
                      Accessibility: {booking.accessibility}
                    </Typography>
                    <Typography variant="h6" color="#333" sx={{ mt: 1 }}>
                      Tags: {booking.tags.map((tag) => tag.name).join(", ")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="#333" sx={{ mt: 2 }}>
                      Activities:
                    </Typography>
                    <ul>
                      {booking.activities.map((activity) => (
                        <li key={activity._id}>
                          <Typography variant="body1">{activity.name}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>

          {/* Booking Actions */}
          <CardActions sx={{ justifyContent: "space-between", padding: "24px 32px" }}>
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
              <Button
                variant="contained"
                color="primary"
                onClick={BookActivity}
                sx={{ fontSize: "1rem", fontWeight: 500, ml: 2 }}
              >
                {type === "Activity" ? "Book Activity" : "Book Itinerary"}
              </Button>
            </Box>
            <Button
              variant="outlined"
              onClick={handleShareToggle}
              startIcon={<ShareIcon />}
              sx={{ fontSize: "1rem", fontWeight: 500 }}
            >
              Share
            </Button>
          </CardActions>

          {/* Share Dialog */}
          <Dialog
            open={shareOpen}
            onClose={handleShareToggle}
            TransitionComponent={Slide}
            TransitionProps={{ direction: "up" }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: "20px 20px 0 0",
                padding: 3,
                backgroundColor: "#F5F7FA",
              },
            }}
          >
            <IconButton onClick={handleShareToggle} sx={{ position: "absolute", top: 8, right: 8 }}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="#333" textAlign="center" sx={{ mt: 2 }}>
              Share {type}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 3 }}>
              <IconButton onClick={handleEmailShare}>
                <EmailIcon sx={{ color: "#5A67D8" }} />
              </IconButton>
              <IconButton onClick={handleCopyLink}>
                <LinkIcon sx={{ color: "#5A67D8" }} />
              </IconButton>
            </Box>
          </Dialog>

          {/* Tour Guide Profile and Review Section for Itineraries */}
          {type === "Itinerary" && tourGuide && (
            <Box sx={{ mt: 5 }}>
              <Card sx={{ boxShadow: 3, padding: 3, borderRadius: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    alt="Profile Picture"
                    src={`http://localhost:8000/uploads/${tourGuide._id}/${tourGuide.profilePicture?.filename}`}
                    sx={{ width: 90, height: 90 }}
                  />
                  <Box sx={{ ml: 3 }}>
                    <Typography variant="h6">{tourGuide.name}</Typography>
                    <Typography variant="body1">Years of Experience: {tourGuide.yearsOfExperience}</Typography>
                    <Typography variant="body2">Previous Work: {tourGuide.previousWork.join(", ")}</Typography>
                    <Button
                      variant={isFollowing ? "outlined" : "contained"}
                      color="primary"
                      onClick={toggleFollow}
                      sx={{ mt: 1 }}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  </Box>
                </Box>
              </Card>

              {/* Review Section */}
              <Card sx={{ mt: 3, boxShadow: 3, padding: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Rate and Comment
                </Typography>
                <Rating
                  name="tourGuideRating"
                  value={rating}
                  onChange={(e, newValue) => setRating(newValue)}
                />
                <TextField
                  fullWidth
                  label="Add Comment"
                  multiline
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mt: 2 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleReviewSubmit}
                  sx={{ mt: 2 }}
                >
                  Submit Review
                </Button>
              </Card>
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default BookingDetails;
