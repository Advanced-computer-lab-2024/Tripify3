import React, { useEffect, useState } from "react";
import { Box, Paper,Dialog,Slide, Rating, Divider, CardActions, Typography, Button, CircularProgress, Grid, Card, CardContent, Avatar, List, ListItem } from "@mui/material";
import { getItineraryById } from "../../services/tourist";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Favorite  } from "@mui/icons-material";
import { Close as CloseIcon, Link as LinkIcon, Email as EmailIcon, } from '@mui/icons-material';
import ShareIcon from "@mui/icons-material/Share";
import IconButton from "@mui/material/IconButton";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { getUserId } from "../../utils/authUtils";


import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import EventNoteIcon from "@mui/icons-material/EventNote";

import { useParams, useNavigate } from "react-router-dom";
const ItineraryDetails = () => {
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
  const [totalPrice, setTotalPrice] = useState(0);
  const handleIncrease = () => setTicketCount(ticketCount + 1);
  const handleDecrease = () => ticketCount > 1 && setTicketCount(ticketCount - 1);
  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const response = await getItineraryById(id);
        console.log(response.data.data);
        setItinerary(response.data.data.itinerary);
        setReview(response.data.data);
        setLoading(false);
        setTotalPrice(response.data.data.price); // Initialize total price based on single ticket
        await fetchTourGuideProfile(response.data.data.itinerary.tourGuide._id, userId);
      } catch (error) {
        setError("Error fetching Itinerary details ");
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [id]);

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
      console.log("0220020202");

      await axios.post(`http://localhost:8000/tourist/follow/${userId}/${itinerary.tourGuide._id}`, followData);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  const BookItinerary = async () => {
    const tourist = getUserId();
    const price = ticketCount * itinerary.price;
    const type = "Itinerary";
    const itemId = itinerary._id;
    const booking = { tourist, price, type, itemId, tickets: ticketCount };
    console.log(booking);
    try {
      const response = await axios.post(`http://localhost:8000/tourist/booking/create`, booking);
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending message:", error);
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

  const handleEmailShare = () => {
    const emailSubject = `Check out this itinerary: ${itinerary.name}`;
  
    // Construct email body with additional itinerary details
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
     `Price: ${itinerary.price} USD\n` +
      `Status: ${itinerary.status}\n\n` +
      `Reviews:\n` +
      `View more details here: http://localhost:3000/tourist/itinerary/${itinerary._id}`;
  
    // Construct Gmail URL for pre-filled subject and body
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
  
    // Open Gmail in a new window or tab in Chrome
    window.open(gmailUrl, '_blank');
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
                    <Typography variant="body1">{itinerary.price}</Typography>
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
                          Price: ${activity.price} (Discount: {activity.specialDiscount}%)
                        </Typography>
                        <Typography variant="body2">Status: {activity.status}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
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
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="600">
                      Share this itinerary
                    </Typography>
                    <IconButton onClick={handleShareToggle}>
                      <CloseIcon />
                    </IconButton>
                  </Box>

                  <Box display="flex" justifyContent="space-around" mt={2}>
                    <IconButton onClick={handleCopyLink} sx={{ flexDirection: "column" }}>
                      <LinkIcon fontSize="large" />
                      <Typography variant="body2">Copy Link</Typography>
                    </IconButton>
                    <IconButton onClick={handleEmailShare} sx={{ flexDirection: "column" }}>
                      <EmailIcon fontSize="large" />
                      <Typography variant="body2">Email</Typography>
                    </IconButton>
                  </Box>
                </Box>
              </Dialog>
              <CardActions sx={{ padding: "24px 32px" }}>
                {/* Book Itinerary Button */}
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
                {/* First Grid for Ticket Count */}
                <Grid container spacing={20} alignItems="center">
                  <Grid item>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {/* Decrease Ticket Button */}
                      <IconButton onClick={handleDecrease} disabled={ticketCount === 1} sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}>
                        <RemoveIcon />
                      </IconButton>
                      {/* Ticket Count */}
                      <Typography variant="h6" sx={{ mx: 1 }}>
                        {ticketCount}
                      </Typography>
                      {/* Increase Ticket Button */}
                      <IconButton onClick={handleIncrease} sx={{ "&:hover": { backgroundColor: "#f0f0f0" } }}>
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container spacing={3} sx={{ mt: 2, justifyContent: "center" }}>
                  {/* Total Price on the Right */}
                  <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography variant="h6" sx={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                      Total Price: ${ticketCount * itinerary.price}
                    </Typography>
                  </Grid>
                </Grid>
              </CardActions>
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
          <Card sx={{ mt: 6, borderRadius: 3, boxShadow: 5, padding: 4 }}>
            <CardContent>
              <Box sx={{ textAlign: "center" }}>
                <Avatar src={`http://localhost:8000/uploads/${itinerary.tourGuide._id}/${itinerary.tourGuide.profilePicture.filename}`} sx={{ width: 150, height: 150, mb: 2, mx: "auto" }} />
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {itinerary.tourGuide.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {itinerary.tourGuide.yearsOfExperience} years of experience
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  ✨ {itinerary.tourGuide.previousWork.join(", ")}
                </Typography>
                <Button variant="contained" color={isFollowing ? "secondary" : "primary"} sx={{ mb: 2 }} onClick={handleFollowToggle} startIcon={<Favorite />}>
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

  //   return (
  //     <Box sx={{ p: 3, backgroundColor: "#F5F7FA", minHeight: "100vh", position: "relative" }}>
  //     <Button variant="contained" color="primary"  onClick={() => navigate(-1)} sx={{ position: "absolute", top: 16, left: 16, fontSize: "1rem", fontWeight: 500 }}>
  //       Go Back
  //     </Button>
  //     <Box sx={{ p: 4 }}>
  //       <Box
  //         sx={{
  //           p: 3,
  //           backgroundColor: "#F5F7FA",
  //           minHeight: "100vh",
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "flex-start",
  //         }}
  //       >
  //         <Card
  //           sx={{
  //             width: "100%",
  //             maxWidth: "900px",
  //             borderRadius: 3,
  //             boxShadow: 5,
  //             padding: 4,
  //             minHeight: "500px",
  //           }}
  //         >
  //          <CardContent>
  //   <Box sx={{ p: 4 }}>
  //     {/* Main Itinerary Header */}
  //     <CardContent>
  //       <Typography variant="h4" textAlign="center" >
  //         {itinerary.name}
  //       </Typography>
  //       <Typography
  //         variant="body2"
  //         color="textSecondary"
  //         textAlign="center"

  //       >
  //         Language: {itinerary.language}
  //       </Typography>
  //     </CardContent>

  //     {/* Tags Section - Centered under Language */}
  //     <Box sx={{ textAlign: "center", mb: 6 }}>
  //       {itinerary.tags && itinerary.tags.length > 0 ? (
  //         <Box sx={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center" }}>
  //           {itinerary.tags.map((tag, index) => (
  //             <Box
  //               key={index}
  //               sx={{
  //                 display: "flex",
  //                 alignItems: "center",
  //                 backgroundColor: "#E2E8F0",
  //                 borderRadius: "12px",
  //                 padding: "6px 12px",
  //                 margin: "4px",
  //                 fontSize: "0.875rem",
  //                 color: "#2D3748",
  //               }}
  //             >
  //               <Typography variant="body2">{tag.name}</Typography>
  //             </Box>
  //           ))}
  //         </Box>
  //       ) : (
  //         <Typography variant="body2" color="textSecondary">
  //           No tags available.
  //         </Typography>
  //       )}
  //     </Box>

  //     {/* Itinerary Summary Section */}
  //     <Grid container spacing={3}>
  //       <Grid item xs={12} sm={6}>
  //         <Box display="flex" alignItems="center">
  //           <LocationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
  //           <Typography variant="body1">
  //             Drop-off Location: {itinerary.dropoffLocation}
  //           </Typography>
  //         </Box>
  //       </Grid>
  //       <Grid item xs={12} sm={6}>
  //         <Box display="flex" alignItems="center">
  //           <EventNoteIcon sx={{ color: "#5A67D8", mr: 1 }} />
  //           <Typography variant="body1">
  //             <strong>Start Date:</strong>{" "}
  //             {new Date(itinerary.timeline.startTime).toLocaleDateString()}
  //           </Typography>
  //         </Box>
  //       </Grid>
  //       <Grid item xs={12} sm={6}>
  //         <Box display="flex" alignItems="center">
  //           <EventNoteIcon sx={{ color: "#5A67D8", mr: 1 }} />
  //           <Typography variant="body1">
  //             <strong>End Date:</strong>{" "}
  //             {new Date(itinerary.timeline.endTime).toLocaleDateString()}
  //           </Typography>
  //         </Box>
  //       </Grid>
  //       <Grid item xs={12} sm={6}>
  //         <Box display="flex" alignItems="center">
  //           <MonetizationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
  //           <Typography variant="body1">
  //             {itinerary.price}
  //           </Typography>
  //         </Box>
  //       </Grid>
  //     </Grid>

  //     {/* Activities Section */}
  //     <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
  //       Activities
  //     </Typography>
  //     <Grid container spacing={3}>
  //       {itinerary.activities.map((activity) => (
  //         <Grid item xs={12} sm={6} key={activity._id}>
  //           <Card>
  //             <CardContent>
  //               <Typography variant="h6">{activity.name}</Typography>
  //               <Typography variant="body2" color="textSecondary">
  //                 Location: {activity.location}
  //               </Typography>
  //               <Typography variant="body2">
  //                 Date: {new Date(activity.date).toLocaleDateString()}
  //               </Typography>
  //               <Typography variant="body2">
  //                 Duration: {activity.duration} minutes
  //               </Typography>
  //               <Typography variant="body2">
  //                 Price: ${activity.price} (Discount:{" "}
  //                 {activity.specialDiscount}%)
  //               </Typography>
  //               <Typography variant="body2">
  //                 Status: {activity.status}
  //               </Typography>
  //             </CardContent>
  //           </Card>
  //         </Grid>
  //       ))}
  //     </Grid>

  {
    /* Places Section */
  }
  // <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
  //   Places
  // </Typography>
  // {itinerary.places.map((place) => (
  //   <Box key={place._id} sx={{ mb: 4 }}>
  //     <Typography variant="h6">{place.name}</Typography>
  //     <Typography variant="body2" color="textSecondary">
  //       {place.location.address}, {place.location.city}, {place.location.country}
  //     </Typography>
  //     <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
  //       {place.description}
  //     </Typography>
  //     <Typography variant="body2">
  //       <strong>Ticket Prices:</strong> Foreigner: ${place.ticketPrices.foreigner}, Native: ${place.ticketPrices.native}, Student: ${place.ticketPrices.student}
  //     </Typography>
  //     <Typography variant="body2">
  //       <strong>Opening Hours:</strong>
  //     </Typography>
  //     <List>
  //       {place.openingHours.map((hours, index) => (
  //         <ListItem key={index}>
  //           {hours.day}: {hours.from} - {hours.to}
  //         </ListItem>
  //       ))}
  //     </List>

  //         {/* Display Pictures for each place */}
  //         {place.pictures && place.pictures.length > 0 && (
  //           <Box sx={{ mt: 2 }}>
  //             <Typography variant="body2"><strong>Images:</strong></Typography>
  //             <Grid container spacing={2}>
  //               {place.pictures.map((picture, index) => (
  //                 <Grid item xs={12} sm={6} md={4} key={index}>
  //                   <img
  //                     src={picture}
  //                     alt={`Image ${index + 1}`}
  //                     style={{ width: '100%', borderRadius: '8px' }}
  //                   />
  //                 </Grid>
  //               ))}
  //             </Grid>
  //           </Box>
  //         )}
  //       </Box>
  //     ))}

  //     {/* Tour Guide Section */}
  //     <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
  //       Tour Guide
  //     </Typography>
  //     <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
  //       <Avatar
  //         src={itinerary.tourGuide.profilePicture.filepath}
  //         sx={{ width: 80, height: 80, mr: 2 }}
  //       />
  //       <Box>
  //         <Typography variant="h6">{itinerary.tourGuide.name}</Typography>
  //         <Typography variant="body2">
  //           Experience: {itinerary.tourGuide.yearsOfExperience} years
  //         </Typography>
  //         <Typography variant="body2">
  //           Previous Work: {itinerary.tourGuide.previousWork.join(", ")}
  //         </Typography>
  //         <Typography variant="body2">
  //           Phone: {itinerary.tourGuide.phoneNumber}
  //         </Typography>
  //         <Typography variant="body2">
  //           Email: {itinerary.tourGuide.email}
  //         </Typography>
  //       </Box>
  //     </Box>

  //     {/* Available Dates and Times */}
  //     {/* <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
  //       Available Dates & Times
  //     </Typography>
  //     <List>
  //       {itinerary.availableDates.map((date) => (
  //         <ListItem key={date._id}>
  //           <Typography variant="body1">
  //             {new Date(date.date).toLocaleDateString()} - Available Times: {date.times.join(", ")}
  //           </Typography>
  //         </ListItem>
  //       ))}
  //     </List> */}
  //   </Box>
  // </CardContent>

  // <CardActions sx={{ padding: "24px 32px" }}>

  //   {/* Share Button */}
  //   <Box sx={{ mt: 2 }}>
  //     <Button
  //       variant="outlined"
  //       onClick={handleShareToggle}
  //       startIcon={<ShareIcon />}
  //       sx={{
  //         fontSize: "1rem",
  //         fontWeight: 500,
  //         textTransform: "none",
  //         '&:hover': {
  //           backgroundColor: "#e0e0e0",
  //         },
  //       }}
  //     >
  //       Share
  //     </Button>
  //   </Box>
  // </CardActions>
  // <CardActions sx={{ padding: "24px 32px" }}>
  //    {/* Book Itinerary Button */}
  //    <Grid item>
  //   <Button
  //     variant="contained"
  //     color="primary"
  //     onClick={BookItinerary}
  //     sx={{
  //       fontSize: "1rem",
  //       fontWeight: 500,
  //       textTransform: "none",
  //       whiteSpace: "nowrap",  // Prevents text from wrapping
  //       width: "100%", // Ensures the button stretches across the full container width
  //       '&:hover': {
  //         backgroundColor: "#4c73d1",
  //       },
  //     }}
  //   >
  //     Book Itinerary
  //   </Button>
  // </Grid>
  //   {/* First Grid for Ticket Count */}
  //   <Grid container spacing={20} alignItems="center">
  //     <Grid item>
  //       <Box sx={{ display: "flex", alignItems: "center" }}>
  //         {/* Decrease Ticket Button */}
  //         <IconButton onClick={handleDecrease} disabled={ticketCount === 1} sx={{ '&:hover': { backgroundColor: "#f0f0f0" } }}>
  //           <RemoveIcon />
  //         </IconButton>
  //         {/* Ticket Count */}
  //         <Typography variant="h6" sx={{ mx: 1 }}>
  //           {ticketCount}
  //         </Typography>
  //         {/* Increase Ticket Button */}
  //         <IconButton onClick={handleIncrease} sx={{ '&:hover': { backgroundColor: "#f0f0f0" } }}>
  //           <AddIcon />
  //         </IconButton>
  //       </Box>
  //     </Grid>
  //   </Grid>

  //   <Grid container spacing={3} sx={{ mt: 2, justifyContent: "center" }}>
  //   {/* Total Price on the Right */}
  //   <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
  //     <Typography variant="h6" sx={{ fontWeight: 500, whiteSpace: "nowrap" }}>
  //       Total Price: ${ticketCount * itinerary.price}
  //     </Typography>
  //   </Grid>
  // </Grid>

  // </CardActions>

  //           <Dialog
  //             open={shareOpen}
  //             onClose={handleShareToggle}
  //             TransitionComponent={Slide}
  //             TransitionProps={{ direction: "up" }}
  //             sx={{
  //               "& .MuiPaper-root": {
  //                 borderRadius: "20px 20px 0 0",
  //                 minHeight: "250px",
  //                 backgroundColor: "#FFF",
  //               },
  //             }}
  //           >
  //             <Box sx={{ p: 3 }}>
  //               <Box
  //                 display="flex"
  //                 justifyContent="space-between"
  //                 alignItems="center"
  //               >
  //                 <Typography variant="h6" fontWeight="600">
  //                   Share this itinerary
  //                 </Typography>
  //                 <IconButton onClick={handleShareToggle}>
  //                   <CloseIcon />
  //                 </IconButton>
  //               </Box>

  //               <Box display="flex" justifyContent="space-around" mt={2}>
  //                 <IconButton
  //                   onClick={handleCopyLink}
  //                   sx={{ flexDirection: "column" }}
  //                 >
  //                   <LinkIcon fontSize="large" />
  //                   <Typography variant="body2">Copy Link</Typography>
  //                 </IconButton>
  //                 <IconButton
  //                   onClick={handleEmailShare}
  //                   sx={{ flexDirection: "column" }}
  //                 >
  //                   <EmailIcon fontSize="large" />
  //                   <Typography variant="body2">Email</Typography>
  //                 </IconButton>
  //               </Box>
  //             </Box>
  //           </Dialog>
  //         </Card>
  //       </Box>
  //     </Box>
  //     </Box>
  //   );
};

export default ItineraryDetails;
