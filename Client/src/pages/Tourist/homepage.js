import React from "react";
import { Grid, Box, Typography, Button, Card, CardMedia, CardContent, CardActionArea } from "@mui/material";
// Import the image from your local repo
import homepageImage from "../../assets/homepageImage.jpeg"; // Adjust the path to your image file



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
  {
    id: 5,
    name: "Kempinski Nile Hotel",
    location: "Cairo, Egypt",
    image: "https://via.placeholder.com/400",
  },
];









const TouristHomepage = () => {
  return (
    // Remove the bigger surrounding Box
    <Card
      sx={{
        width: "80%",
        margin: "auto", // Center the card horizontally
        backgroundColor: "#fff",
        padding: "30px",
        boxShadow: 3,
        borderRadius: "16px", // Add border radius here
      }}
    >
      {/* Header Section */}
      <Box sx={{ textAlign: "center", marginBottom: "30px" }}>
        <Typography variant="h4">Welcome to Tripify!</Typography>
      </Box>

      {/* Image Placeholder (instead of search fields) */}
      <CardMedia
        component="img"
        height="250"
        image={homepageImage}
        alt="Search Placeholder"
        sx={{ width: "100%", marginBottom: "30px", borderRadius: "8px" }} // Add border radius to the image
      />

      {/* Hotel and Airbnb Suggestions */}
      <Box sx={{ marginTop: "30px" }}>
        <Typography variant="h5" sx={{ marginBottom: "20px" }}>
          Iternaries
        </Typography>

        {/* Scrollable Horizontal Section */}
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            paddingBottom: "80px",
            "&::-webkit-scrollbar": {
              display: "none", // Hides the scrollbar for WebKit browsers (Chrome, Safari)
            },
          }}
        >
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              sx={{
                minWidth: "300px",
                marginRight: "15px",
                boxShadow: 2,
                borderRadius: "12px",
              }}
            >
              <CardActionArea>
                <CardMedia component="img" height="140" image={hotel.image} alt={hotel.name} sx={{ borderRadius: "12px" }} />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {hotel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hotel.location}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>        
      </Box>

      {/* Hotel and Airbnb Suggestions */}
      <Box sx={{ marginTop: "30px" }}>
        <Typography variant="h5" sx={{ marginBottom: "20px" }}>
          Iternaries
        </Typography>

        {/* Scrollable Horizontal Section */}
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            paddingBottom: "80px",
            "&::-webkit-scrollbar": {
              display: "none", // Hides the scrollbar for WebKit browsers (Chrome, Safari)
            },
          }}
        >
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              sx={{
                minWidth: "300px",
                marginRight: "15px",
                boxShadow: 2,
                borderRadius: "12px",
              }}
            >
              <CardActionArea>
                <CardMedia component="img" height="140" image={hotel.image} alt={hotel.name} sx={{ borderRadius: "12px" }} />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {hotel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hotel.location}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        
      </Box>

      {/* Hotel and Airbnb Suggestions */}
      <Box sx={{ marginTop: "30px" }}>
        <Typography variant="h5" sx={{ marginBottom: "20px" }}>
          Activities
        </Typography>

        {/* Scrollable Horizontal Section */}
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            paddingBottom: "80px",
            "&::-webkit-scrollbar": {
              display: "none", // Hides the scrollbar for WebKit browsers (Chrome, Safari)
            },
          }}
        >
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              sx={{
                minWidth: "300px",
                marginRight: "15px",
                boxShadow: 2,
                borderRadius: "12px",
              }}
            >
              <CardActionArea>
                <CardMedia component="img" height="140" image={hotel.image} alt={hotel.name} sx={{ borderRadius: "12px" }} />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {hotel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hotel.location}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        
      </Box>

      {/* Hotel and Airbnb Suggestions */}
      <Box sx={{ marginTop: "30px" }}>
        <Typography variant="h5" sx={{ marginBottom: "20px" }}>
          Hotels
        </Typography>

        {/* Scrollable Horizontal Section */}
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            paddingBottom: "80px",
            "&::-webkit-scrollbar": {
              display: "none", // Hides the scrollbar for WebKit browsers (Chrome, Safari)
            },
          }}
        >
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              sx={{
                minWidth: "300px",
                marginRight: "15px",
                boxShadow: 2,
                borderRadius: "12px",
              }}
            >
              <CardActionArea>
                <CardMedia component="img" height="140" image={hotel.image} alt={hotel.name} sx={{ borderRadius: "12px" }} />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {hotel.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hotel.location}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        
      </Box>
    </Card>
  );
};

export default TouristHomepage;
