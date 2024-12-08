import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, Button, Card, CardMedia, CardContent, CardActionArea } from "@mui/material";
import { Carousel } from "react-responsive-carousel"; // Install this package with `npm install react-responsive-carousel`
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import ritzCarlton from "../../assets/ritzCarlton.jpeg";
import fourSeasons from "../../assets/fourSeasons.jpeg";
import sofitelCairo from "../../assets/sofitelCairo.jpeg";
import oldCataract from "../../assets/oldCataract.jpeg";
import activityPic from "../../assets/activity.jpeg";
import itineraryPic from "../../assets/itinerary.jpeg";
import homepageImage from "../../assets/homepageImage.jpeg"; // Adjust the path to your image file
import Fab from "@mui/material/Fab"; // Import Floating Action Button
import ChatIcon from "@mui/icons-material/Chat"; // Import Chat Icon
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { Link } from "react-router-dom";
import RobotIcon from "@mui/icons-material/EmojiPeople";
import AssistantIcon from "@mui/icons-material/Assistant"; // Import the Assistant icon
import { FaRobot } from "react-icons/fa";
import { AccessTime, FlightTakeoff, Store, DirectionsCar, LocalActivity, MonetizationOn, Notifications, Diamond, LocationOn } from "@mui/icons-material"; // Import Material UI Icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { getUserId } from "../../utils/authUtils";
import { getAllActiveAppropriateIteneraries, getAllActivitiesForTourist } from "../../services/tourist.js";

const hotels = [
  {
    id: 1,
    name: "The Nile Ritz Carlton Hotel",
    location: "Cairo, Egypt",
    image: ritzCarlton,
  },
  {
    id: 2,
    name: "Four Seasons Hotel",
    location: "Cairo, Egypt",
    image: fourSeasons,
  },
  {
    id: 3,
    name: "Sofitel Cairo Nile El Gezirah",
    location: "Cairo, Egypt",
    image: sofitelCairo,
  },
  {
    id: 4,
    name: "Old Cataract Hotel",
    location: "Aswan, Egypt",
    image: oldCataract,
  },
];

const keyFeatures = [
  {
    title: "Personalized Travel Planning",
    description: "Tailor your vacation with preferences like historic sites, beaches, shopping, and budget-friendly options.",
    icon: <AccessTime sx={{ fontSize: 40, color: "#004b8d" }} />,
  },
  {
    title: "Seamless Booking",
    description: "Book flights, hotels, and transportation directly within the app through trusted third-party services.",
    icon: <FlightTakeoff sx={{ fontSize: 40, color: "#004b8d" }} />,
  },
  {
    title: "Smart Budgeting",
    description: "Get activity suggestions that fit your remaining budget after booking flights and hotels.",
    icon: <MonetizationOn sx={{ fontSize: 40, color: "#004b8d" }} />, // Updated to MonetizationOn
  },
  {
    title: "Discover Local Gems",
    description: "Explore curated activities, museums, and historical landmarks.",
    icon: <Diamond sx={{ fontSize: 40, color: "#004b8d" }} />, // Updated to Diamond (Gem)
  },
  {
    title: "Real-Time Notifications",
    description: "Stay updated on upcoming events and activities you’ve booked.",
    icon: <Notifications sx={{ fontSize: 40, color: "#004b8d" }} />, // Updated to Notifications (Bell)
  },
  {
    title: "Tour Guide Itinerary",
    description: "Get the best itineraries with mapped tours, ideal for your adventure.",
    icon: <LocationOn sx={{ fontSize: 40, color: "#004b8d" }} />, // Updated to LocationOn (Pin)
  },
];

const TouristHomepage = () => {
  const navigate = useNavigate(); // Hook to navigate to the chatbot page

  //const { id } = useParams();
  const userId = getUserId();
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch itineraries data
    const fetchItineraries = async () => {
      try {
        let itinerariesResponse;
        itinerariesResponse = await getAllActiveAppropriateIteneraries(userId);
        setItineraries(itinerariesResponse.data.data);
      } catch (error) {
        setError("Error fetching itineraries");
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, [userId]);

  useEffect(() => {
    // Fetch activities data
    const fetchActivities = async () => {
      try {
        let activitiesResponse;
        activitiesResponse = await getAllActivitiesForTourist(userId);
        setActivities(activitiesResponse.data.activities);
      } catch (error) {
        setError("Error fetching activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [userId]);

  // Scroll to Itineraries and Activities section when "Explore More" is clicked
  const scrollToSections = () => {
    const itinerariesSection = document.getElementById("itineraries-section");
    itinerariesSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ width: "100%", margin: "0 auto", padding: "20px" }}>
      {/* Image Carousel Section */}
      <Box
        sx={{
          backgroundColor: "white",
          padding: "40px 30px",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "80px", // Increased space between carousel and the mission
        }}
      >
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {/* Image Carousel */}
          <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "center" }}>
            <Carousel autoPlay infiniteLoop showArrows={false} showThumbs={false}>
              {hotels.map((hotel) => (
                <div key={hotel.id}>
                  <CardMedia component="img" height="450" image={hotel.image} alt={hotel.name} sx={{ borderRadius: "8px" }} />
                  <Typography className="legend">{hotel.name}</Typography>
                </div>
              ))}
            </Carousel>
          </Grid>
        </Grid>
      </Box>

      {/* Our Mission Section */}
      <Box
        sx={{
          color: "black",
          padding: "40px 30px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            marginBottom: "20px", // Adjust space between title and body
          }}
        >
          Our Mission
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginBottom: "20px",
            fontSize: "1rem",
            textAlign: "center",
          }}
        >
          Introducing our all-in-one travel platform designed to make your vacation planning effortless and exciting! Whether you’re dreaming of historic landmarks, relaxing beaches, or
          family-friendly adventures, we bring everything together for the perfect trip.
        </Typography>

        {/* Get Started */}
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            marginBottom: "50px",
            fontSize: "1rem",
            textAlign: "center",
          }}
        >
          Start your vacation with us today and experience the world in a whole new way!
        </Typography>

        {/* Explore More Button */}
        <Button
          onClick={scrollToSections}
          sx={{
            backgroundColor: "#004b8d", // Dark blue color
            color: "white",
            borderRadius: "50px", // Round edges
            padding: "8px 20px", // Smaller button size
            fontSize: "1rem",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Blurry effect on the button
            "&:hover": {
              backgroundColor: "#003366", // Darker blue on hover
            },
            marginBottom: "120px",
          }}
        >
          Explore More
        </Button>
      </Box>

      {/* Key Features Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column", // Stack vertically
          alignItems: "center", // Center items
          marginTop: "40px",
        }}
      >
        {/* Key Features */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Key Features
        </Typography>

        {/* First Row: Personalized Travel Planning, Seamless Booking, Smart Budgeting */}
        <Grid container spacing={4} justifyContent="center">
          {keyFeatures.slice(0, 3).map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "3px solid #004b8d", // Blue outline
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Card shadow
                  transition: "transform 0.3s", // Animation for hover effect
                  "&:hover": {
                    transform: "scale(1.1)", // Enlarge the card on hover
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Second Row: Discover Local Gems, Real-Time Notifications, Tour Guide Itinerary */}
        <Grid container spacing={4} justifyContent="center" sx={{ marginTop: "40px" }}>
          {keyFeatures.slice(3).map((feature, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "3px solid #004b8d",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                  marginBottom: "120px",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>{feature.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Itineraries Section */}
      <Box
        sx={{
          marginTop: "80px",
          padding: "20px 30px",
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        id="itineraries-section"
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: "40px" }}>
          Explore Itineraries
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {itineraries.map((itinerary) => (
            <Grid item xs={12} sm={6} md={4} key={itinerary._id}>
              <Card
                sx={{
                  borderRadius: "12px",
                  border: "2px solid #004b8d",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.3s",
                  },
                }}
              >
                <CardMedia component="img" height="180" image={itineraryPic} alt={itinerary.name} sx={{ borderRadius: "12px 12px 0 0" }} />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {itinerary.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {itinerary.description}
                  </Typography>
                  <Box sx={{ marginTop: "10px", textAlign: "center" }}>
                    <Button
                      component={Link}
                      to={`/tourist/itinerary/${itinerary._id}`} // Adjust the URL as needed
                      sx={{
                        backgroundColor: "#004b8d", // Dark blue color
                        color: "white",
                        borderRadius: "50px", // Round edges
                        padding: "8px 20px", // Smaller button size
                        fontSize: "0.9rem",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Blurry effect on the button
                        "&:hover": {
                          backgroundColor: "#003366", // Darker blue on hover
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* View More Button */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <Button
            component={Link}
            to={`/tourist/itineraries`}
            sx={{
              backgroundColor: "#004b8d", // Dark blue color
              color: "white",
              borderRadius: "50px", // Round edges
              padding: "8px 20px", // Smaller button size
              fontSize: "1rem",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Blurry effect on the button
              "&:hover": {
                backgroundColor: "#003366", // Darker blue on hover
              },
            }}
          >
            View All Itineraries
          </Button>
        </Box>
      </Box>

      {/* Activities Section */}
      <Box
        sx={{
          marginTop: "80px",
          padding: "20px 30px",
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: "40px" }}>
          Explore Activities
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {activities.map((activity) => (
            <Grid item xs={12} sm={6} md={4} key={activity._id}>
              <Card
                sx={{
                  borderRadius: "12px",
                  border: "2px solid #004b8d",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    transition: "transform 0.3s",
                  },
                }}
              >
                <CardMedia component="img" height="180" image={activityPic} alt={activity.name} sx={{ borderRadius: "12px 12px 0 0" }} />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {activity.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.description}
                  </Typography>
                  <Box sx={{ marginTop: "10px", textAlign: "center" }}>
                    <Button
                      component={Link}
                      to={`/activity/${activity._id}`} // Adjust the URL as needed
                      sx={{
                        backgroundColor: "#004b8d", // Dark blue color
                        color: "white",
                        borderRadius: "50px", // Round edges
                        padding: "8px 20px", // Smaller button size
                        fontSize: "0.9rem",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Blurry effect on the button
                        "&:hover": {
                          backgroundColor: "#003366", // Darker blue on hover
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* View More Button */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <Button
            component={Link}
            to={`/tourist/activities`}
            sx={{
              backgroundColor: "#004b8d", // Dark blue color
              color: "white",
              borderRadius: "50px", // Round edges
              padding: "8px 20px", // Smaller button size
              fontSize: "1rem",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Blurry effect on the button
              "&:hover": {
                backgroundColor: "#003366", // Darker blue on hover
              },
            }}
          >
            View All Activities
          </Button>
        </Box>
      </Box>

      {/* Contact Us & Connect With Us Section */}
      <Box
        sx={{
          backgroundColor: "#007958",
          padding: "40px 20px",
          marginTop: "50px",
          color: "white",
          textAlign: "center",
          borderRadius: "20px", // Rounded edges
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {/* Contact Us */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
              Contact Us
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "10px" }}>
              Email: tripify.planner@gmail.com
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: "10px" }}>
              Phone: +1 234 567 890
            </Typography>
            <Typography variant="body1">Address: 123 Vacation Street, Cairo, Egypt</Typography>
          </Grid>

          {/* Connect With Us */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: "20px" }}>
              {/* Facebook */}
              <Button
                href="https://facebook.com"
                target="_blank"
                sx={{
                  color: "white",
                  backgroundColor: "#3b5998", // Facebook blue
                  "&:hover": {
                    backgroundColor: "white", // White background on hover
                    color: "#3b5998", // Change icon color to Facebook blue
                  },
                  borderRadius: "50%",
                  minWidth: "50px",
                  minHeight: "50px",
                }}
              >
                <FacebookIcon />
              </Button>
              {/* Twitter */}
              <Button
                href="https://twitter.com"
                target="_blank"
                sx={{
                  color: "white",
                  backgroundColor: "#00acee", // Twitter blue
                  "&:hover": {
                    backgroundColor: "white", // White background on hover
                    color: "#00acee", // Change icon color to Twitter blue
                  },
                  borderRadius: "50%",
                  minWidth: "50px",
                  minHeight: "50px",
                }}
              >
                <TwitterIcon />
              </Button>
              {/* Instagram */}
              <Button
                href="https://instagram.com"
                target="_blank"
                sx={{
                  color: "white",
                  backgroundColor: "#e4405f", // Instagram pink
                  "&:hover": {
                    backgroundColor: "white", // White background on hover
                    color: "#e4405f", // Change icon color to Instagram pink
                  },
                  borderRadius: "50%",
                  minWidth: "50px",
                  minHeight: "50px",
                }}
              >
                <InstagramIcon />
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default TouristHomepage;
