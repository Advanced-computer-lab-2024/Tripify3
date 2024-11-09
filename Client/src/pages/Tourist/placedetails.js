import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, CircularProgress, Grid, Card, CardContent, CardActions, IconButton, Dialog, Slide } from "@mui/material";
import {
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  MonetizationOn as MonetizationOnIcon,
  Star as StarIcon,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);

  const handleIncrease = () => setTicketCount(ticketCount + 1);
  const handleDecrease = () => ticketCount > 1 && setTicketCount(ticketCount - 1);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/place/get/${id}`);
        setPlace(response.data.data.place);
        setLoading(false);
      } catch (error) {
        setError("Error fetching place details");
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  const toggleShareDropdown = () => setShareOpen(!shareOpen);

  const handleCopyLink = () => {
    const link = `http://localhost:3000/tourist/place/${place._id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
      setShareOpen(false);
    });
  };

  const BookPlace = async () => {
    const tourist = getUserId();
    const price = ticketCount * (place.ticketPrices.foreigner || 0);
    const booking = { tourist, price, type: "Place", itemId: place._id, tickets: ticketCount };

    try {
      const response = await axios.post(`http://localhost:8000/tourist/booking/create`, booking);
      alert(response.data.message);
    } catch (error) {
      console.error("Error booking place:", error);
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
              {place.name}
            </Typography>

            <Typography variant="body1" color="#666" gutterBottom>
              {place.description}
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
                    Foreigner: {place.ticketPrices.foreigner}, Native: {place.ticketPrices.native}, Student: {place.ticketPrices.student}
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
          </CardContent>

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

            <Button variant="outlined" onClick={toggleShareDropdown} startIcon={<ShareIcon />} sx={{ fontSize: "1rem", fontWeight: 500 }}>
              Share
            </Button>
          </CardActions>

          <Dialog
            open={shareOpen}
            onClose={toggleShareDropdown}
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
            <IconButton onClick={toggleShareDropdown} sx={{ position: "absolute", top: 8, right: 8 }}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="#333" textAlign="center" sx={{ mt: 2 }}>
              Share Place
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-evenly", mt: 3 }}>
              <IconButton onClick={() => window.location.href = `mailto:?subject=Check out this place&body=I thought you might be interested in this place!\n\n${place.name}\nLocation: ${place.location.address}, ${place.location.city}\n\nView more details here: http://localhost:3000/tourist/place/${place._id}`}>
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

export default PlaceDetails;
