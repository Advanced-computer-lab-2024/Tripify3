import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Card, CardContent, CardActions, IconButton, Avatar, TextField, Dialog, Slide, Rating } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";
import ShareIcon from "@mui/icons-material/Share";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { getUserId } from "../../utils/authUtils";

// API functions to fetch Activity and Itinerary details
export const getActivityById = async (id) => {
  const response = await axios.get(`http://localhost:8000/activity/get/${id}`);
  return response;
};

export const getItineraryById = async (id) => {
  const response = await axios.get(`http://localhost:8000/itinerary/get/${id}`);
  console.log(response.data);

  return response;
};

const BookingDetails = () => {
  const { itemId, type } = useParams();
  const [booking, setBooking] = useState(null);
  const [tourGuide, setTourGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // Based on the booking type, fetch either activity or itinerary
        let bookingData;
        if (type === "Activity") {
          const activityResponse = await getActivityById(itemId);
          bookingData = activityResponse.data.data;
        } else if (type === "Itinerary") {
          const itineraryResponse = await getItineraryById(itemId);
          bookingData = itineraryResponse.data.data;

          console.log(bookingData.tourGuide);

          // Fetch tour guide profile if it's an itinerary
   
            fetchTourGuideProfile(bookingData.tourGuide);
          
        }

        setBooking(bookingData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching booking details");
        setLoading(false);
      }
    };

    const fetchTourGuideProfile = async (tourGuideId) => {
      const touristId = getUserId();
      try {
        const response = await axios.get(`http://localhost:8000/booking/get/tour-guide/profile/${tourGuideId}/${touristId}`);
        setTourGuide(response.data.tourGuide);
        setIsFollowing(response.data.isFollowing);
        setLoading(false);
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
        itineraryId: booking.itineraryId, // If it's an itinerary review
        activityId: booking.activityId, // If it's an activity review
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
    <Box sx={{ p: 4 }}>
      <Button variant="contained" color="primary" href="/tourist/bookings" sx={{ mt: 2 }}>
        Back to Bookings
      </Button>

      {tourGuide && (
        <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
          <Avatar alt="Profile Picture" src={`http://localhost:8000/uploads/${tourGuide._id}/${tourGuide.profilePicture?.filename}`} sx={{ width: 90, height: 90 }} />
          <Box sx={{ ml: 3 }}>
            <Typography variant="h6">{tourGuide.name}</Typography>
            <Typography variant="body1">Years of Experience: {tourGuide.yearsOfExperience}</Typography>
            <Typography variant="body2">Previous Work: {tourGuide.previousWork.join(", ")}</Typography>
            <Button variant={isFollowing ? "outlined" : "contained"} color="primary" onClick={toggleFollow} sx={{ mt: 1 }}>
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </Box>
        </Box>
      )}

      <Card sx={{ mt: 3, boxShadow: 5 }}>
        <CardContent>
          <Typography variant="h5" color="primary" gutterBottom>
            Booking Details
          </Typography>
          {booking?.type === "Activity" && (
            <>
              <Typography variant="body1">
                <strong>Activity Name:</strong> {booking.name}
              </Typography>
              <Typography variant="body1">
                <strong>Price:</strong> ${booking.price}
              </Typography>
              <Typography variant="body1">
                <strong>Location:</strong> {booking.location}
              </Typography>
              <Typography variant="body1">
                <strong>Time:</strong> {booking.time}
              </Typography>
            </>
          )}
          {booking?.type === "Itinerary" && (
            <>
              <Typography variant="body1">
                <strong>Itinerary Name:</strong> {booking.name}
              </Typography>
              <Typography variant="body1">
                <strong>Price:</strong> ${booking.price}
              </Typography>
              <Typography variant="body1">
                <strong>Duration:</strong> {booking.duration} days
              </Typography>
              <Typography variant="body1">
                <strong>Activities:</strong> {booking.activities.join(", ")}
              </Typography>
            </>
          )}
        </CardContent>

        {/* Show Review Section if Following */}
        {isFollowing && (
          <CardActions sx={{ justifyContent: "space-between", p: 3 }}>
            <Box sx={{ width: "100%" }}>
              <Typography variant="h6">Rate and Comment</Typography>
              <Rating name="tourGuideRating" value={rating} onChange={(e, newValue) => setRating(newValue)} />
              <TextField fullWidth label="Add Comment" multiline rows={4} value={comment} onChange={(e) => setComment(e.target.value)} sx={{ mt: 2 }} />
              <Button variant="contained" color="primary" onClick={handleReviewSubmit} sx={{ mt: 2 }}>
                Submit Review
              </Button>
            </Box>
          </CardActions>
        )}
      </Card>

      <Dialog
        open={shareOpen}
        onClose={handleShareToggle}
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "20px 20px 0 0",
            minHeight: "250px",
            backgroundColor: "#FFF",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" align="center">
            Share Booking Details
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="outlined" color="primary" startIcon={<ShareIcon />} onClick={handleCopyLink}>
              Copy Link
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default BookingDetails;
