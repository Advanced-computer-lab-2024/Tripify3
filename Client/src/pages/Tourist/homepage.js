import React from "react";
import { Grid, Box, Typography, Button, Card, CardMedia, CardContent, CardActionArea } from "@mui/material";
import { Carousel } from 'react-responsive-carousel'; // Install this package with `npm install react-responsive-carousel`
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import homepageImage from "../../assets/homepageImage.jpeg"; // Adjust the path to your image file
import Fab from "@mui/material/Fab"; // Import Floating Action Button
import ChatIcon from "@mui/icons-material/Chat"; // Import Chat Icon
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import RobotIcon from "@mui/icons-material/EmojiPeople"; 
import AssistantIcon from "@mui/icons-material/Assistant"; // Import the Assistant icon
import { FaRobot } from "react-icons/fa";


const hotels = [
  {
    id: 1,
    name: "Steigenberger Aldau Beach Hotel",
    location: "Hurghada, Egypt",
    image: homepageImage,
  },
  {
    id: 2,
    name: "Rixos Alamein Hotel",
    location: "Alamein, North Coast",
    image: homepageImage,
  },
  {
    id: 3,
    name: "Four Seasons Sharm El Sheikh",
    location: "Sharm El Sheikh, Egypt",
    image: homepageImage,
  },
  {
    id: 4,
    name: "Marriott Mena House",
    location: "Cairo, Egypt",
    image: homepageImage,
  },
];

const TouristHomepage = () => {
  const navigate = useNavigate(); // Hook to navigate to the chatbot page

  return (

    <Card
      sx={{
        width: "90%",
        margin: "auto",
        backgroundColor: "#f5f5f5", // Light background for better contrast
        padding: "30px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
      }}
    >
      <Box sx={{ textAlign: "center", marginBottom: "30px" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#3f51b5" }}>Welcome to Tripify!</Typography>
      </Box>

      {/* Image Carousel */}
      <Carousel autoPlay infiniteLoop showArrows={false} showThumbs={false}>
        {hotels.map((hotel) => (
          <div key={hotel.id}>
            <CardMedia
              component="img"
              height="250"
              image={hotel.image}
              alt={hotel.name}
              sx={{ borderRadius: "8px" }}
            />
            <Typography className="legend">{hotel.name}</Typography>
          </div>
        ))}
      </Carousel>

      {/* Section for Iternaries */}
      <Box sx={{ marginTop: "30px" }}>
        <Typography variant="h5" sx={{ marginBottom: "20px", fontWeight: "bold", color: "#3f51b5" }}>
          Iternaries
        </Typography>
        <Grid container spacing={2}>
          {hotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={3} key={hotel.id}>
              <Card sx={{ borderRadius: "12px" }}>
                <CardActionArea>
                  <CardMedia component="img" height="140" image={hotel.image} alt={hotel.name} sx={{ borderRadius: "12px" }} />
                  <CardContent>
                    <Typography gutterBottom variant="h6" sx={{ fontWeight: "600" }}>
                      {hotel.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hotel.location}
                    </Typography>
                    <Button variant="contained" sx={{ marginTop: 1 }} color="primary">View More</Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Section for Activities */}
      <Box sx={{ marginTop: "30px" }}>
        <Typography variant="h5" sx={{ marginBottom: "20px", fontWeight: "bold", color: "#3f51b5" }}>
          Activities
        </Typography>
        <Grid container spacing={2}>
          {hotels.map((hotel) => (
            <Grid item xs={12} sm={6} md={3} key={hotel.id}>
              <Card sx={{ borderRadius: "12px" }}>
                <CardActionArea>
                  <CardMedia component="img" height="140" image={hotel.image} alt={hotel.name} sx={{ borderRadius: "12px" }} />
                  <CardContent>
                    <Typography gutterBottom variant="h6" sx={{ fontWeight: "600" }}>
                      {hotel.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hotel.location}
                    </Typography>
                    <Button variant="contained" sx={{ marginTop: 1 }} color="primary">Explore</Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
       {/* Add the floating chatbot button */}
       <Fab 
        color="primary" 
        aria-label="chatbot" 
        sx={{ position: "fixed", bottom: 26, right: 26 }} // Positioned at the bottom right
        onClick={() => navigate("/chatbot")} // Navigate to the chatbot page when clicked
      >
  <FaRobot style={{ width: '35px', height: '35px' }} /> {/* Set width and height */}
  </Fab>
    </Card>
  );
};

export default TouristHomepage;