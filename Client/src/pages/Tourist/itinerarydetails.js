import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  Slide,
} from "@mui/material";
import { getItineraryById } from "../../services/tourist";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StarIcon from "@mui/icons-material/Star";
import EventNoteIcon from "@mui/icons-material/EventNote";
import ShareIcon from "@mui/icons-material/Share";
import EmailIcon from "@mui/icons-material/Email";
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Book } from "@mui/icons-material";
import axios from "axios";
import { getUserId } from "../../utils/authUtils";
const ItineraryDetails = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [currentItineraryId, setCurrentItineraryId] = useState(null); // Added this state for dropdown handling
  const [ticketCount, setTicketCount] = useState(1);

  const handleIncrease = () => {
    setTicketCount(ticketCount + 1);
  };

  const handleDecrease = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await getItineraryById(id);
        console.log(response.data.data);
        setItinerary(response.data.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching Itinerary details");
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [id]);

  const toggleShareDropdown = (itineraryId) => {
    if (currentItineraryId === itineraryId) {
      setCurrentItineraryId(null);
    } else {
      setCurrentItineraryId(itineraryId);
    }
  };

  const handleShareToggle = () => {
    setShareOpen(!shareOpen);
  };

  const handleCopyLink = () => {
    const link = `http://localhost:3000/tourist/itinerary/${itinerary._id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert("Link copied to clipboard!");
      setShareOpen(false);
    });
  };
  const BookItinerary = async () => {
    const tourist = getUserId();
    const price = ticketCount * itinerary.price;
    const type = "Itinerary";
    const itemId = itinerary._id;
    const booking = { tourist, price, type, itemId };
    console.log(booking);
    try {
      const response = await axios.post(
        `http://localhost:8000/tourist/booking/create`,
        booking
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const handleEmailShare = () => {
    const emailSubject = `Check out this itinerary: ${itinerary.name}`;
    const emailBody = `I thought you might be interested in this itinerary!\n\n${
      itinerary.name
    }\nLocation: ${itinerary.location}\nDate: ${new Date(
      itinerary.date
    ).toLocaleDateString()} at ${
      itinerary.time
    }\n\nView more details here: http://localhost:3000/tourist/itinerary/${
      itinerary._id
    }`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
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
      <Typography variant="h4" color="black" gutterBottom>
        {itinerary.name}
      </Typography>
      <Typography variant="h6">
        <strong>Price:</strong> ${itinerary.price}
      </Typography>
      <Typography variant="body1">
        <strong>Start Date:</strong>{" "}
        {new Date(itinerary.timeline.startTime).toLocaleDateString()}
      </Typography>
      <Typography variant="body1">
        <strong>End Date:</strong>{" "}
        {new Date(itinerary.timeline.endTime).toLocaleDateString()}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href="/tourist/Itineraries"
        sx={{ mt: 2 }}
      >
        Back to Itineraries
      </Button>
      <Button
        variant="outlined"
        sx={{
          mt: 2,
          ml: 2,
          color: "blue",
          borderColor: "blue",
          "&:hover": {
            backgroundColor: "lightblue",
            color: "white",
          },
        }}
        onClick={() => toggleShareDropdown(itinerary._id)}
      >
        Share
      </Button>

      {currentItineraryId === itinerary._id && (
        <Box
          sx={{
            position: "absolute",
            background: "white",
            boxShadow: 1,
            p: 1,
            mt: 1,
            zIndex: 10,
          }}
        >
          <Button variant="text" onClick={() => handleCopyLink(itinerary._id)}>
            Copy Link
          </Button>
          <Button
            variant="text"
            href={`https://twitter.com/intent/tweet?url=http://localhost:3000/Tourist/Itineraries/${itinerary._id}`}
            target="_blank"
          >
            Share on Twitter
          </Button>
          <Button
            variant="text"
            href={`https://www.facebook.com/sharer/sharer.php?u=http://localhost:3000/Tourist/Itineraries/${itinerary._id}`}
            target="_blank"
          >
            Share on Facebook
          </Button>
        </Box>
      )}

      <Box
        sx={{
          p: 3,
          backgroundColor: "#F5F7FA",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: "900px",
            borderRadius: 3,
            boxShadow: 5,
            padding: 4,
            minHeight: "500px",
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              color="#333"
              gutterBottom
              textAlign="center"
              sx={{ mb: 3 }}
            >
              {itinerary.name}
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LocationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography
                    variant="body1"
                    sx={{ color: "#4A5568", fontWeight: 500 }}
                  >
                    {itinerary.dropoffLocation}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EventNoteIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Start Date:</strong>{" "}
                    {new Date(
                      itinerary.timeline.startTime
                    ).toLocaleDateString()}
                  </Typography>
                  <br />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EventNoteIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography variant="body1">
                    <strong>End Date:</strong>{" "}
                    {new Date(itinerary.timeline.endTime).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{ color: "#4A5568", fontWeight: 500 }}
                  >
                    <strong>Status:</strong>{" "}
                    {itinerary.status}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <MonetizationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                  <Typography
                    variant="body1"
                    sx={{ color: "#4A5568", fontWeight: 500 }}
                  >
                    ${itinerary.price}
                  </Typography>
                </Box>
              </Grid>
            
            </Grid>
          </CardContent>

          <CardActions
            sx={{ justifyContent: "space-between", padding: "24px 32px" }}
          >
            <Button
              variant="contained"
              color="primary"
              href="/tourist/Itineraries"
              sx={{ fontSize: "1rem", fontWeight: 500 }}
            >
              Back to Itineraries
            </Button>
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
                onClick={BookItinerary}
                sx={{ fontSize: "1rem", fontWeight: 500, ml: 2 }}
              >
                Book itinerary
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
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="600">
                  Share this itinerary
                </Typography>
                <IconButton onClick={handleShareToggle}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Box display="flex" justifyContent="space-around" mt={2}>
                <IconButton
                  onClick={handleCopyLink}
                  sx={{ flexDirection: "column" }}
                >
                  <LinkIcon fontSize="large" />
                  <Typography variant="body2">Copy Link</Typography>
                </IconButton>
                <IconButton
                  onClick={handleEmailShare}
                  sx={{ flexDirection: "column" }}
                >
                  <EmailIcon fontSize="large" />
                  <Typography variant="body2">Email</Typography>
                </IconButton>
              </Box>
            </Box>
          </Dialog>
        </Card>
      </Box>
    </Box>
  );
};

export default ItineraryDetails;
