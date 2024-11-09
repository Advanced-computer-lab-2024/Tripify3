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
import { getActivityById } from "../../services/tourist";
import axios from "axios";
import { getUserId } from "../../utils/authUtils";

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);

  const handleIncrease = () => setTicketCount(ticketCount + 1);
  const handleDecrease = () => ticketCount > 1 && setTicketCount(ticketCount - 1);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await getActivityById(id);
        setActivity(response.data.data.activity);
        setLoading(false);
      } catch (error) {
        setError("Error fetching activity details");
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  const toggleShareDropdown = (activityId) => {
    setCurrentActivityId(currentActivityId === activityId ? null : activityId);
  };

  const handleShareToggle = () => setShareOpen(!shareOpen);

  const handleCopyLink = () => {
    const link = `http://localhost:3000/tourist/activity/${activity._id}`;
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

  const handleEmailShare = () => {
    const emailSubject = `Check out this activity: ${activity.name}`;
    const emailBody = `I thought you might be interested in this activity!\n\n${activity.name}\nLocation: ${activity.location}\nDate: ${new Date(activity.date).toLocaleDateString()} at ${
      activity.time
    }\n\nView more details here: http://localhost:3000/tourist/activity/${activity._id}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
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
                    {activity.price}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon
                      key={index}
                      sx={{
                        color: index < activity.rating ? "#ECC94B" : "#E2E8F0", // Highlighted stars for rating, gray for others
                        mr: 0.5,
                      }}
                    />
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
              <Button variant="contained" color="primary" onClick={BookActivity} sx={{ fontSize: "1rem", fontWeight: 500, ml: 2 }}>
                Book Activity
              </Button>
            </Box>
            <Button variant="outlined" onClick={handleShareToggle} startIcon={<ShareIcon />} sx={{ fontSize: "1rem", fontWeight: 500 }}>
              Share
            </Button>
          </CardActions>

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
              Share Activity
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
        </Card>
      </Box>
    </Box>
  );
};

export default ActivityDetails;
