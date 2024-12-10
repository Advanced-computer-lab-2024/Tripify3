import React, { useEffect, useState, Suspense, lazy } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserProfile } from "../../services/tourist"; //////////////////////////////////
import { getUserId } from "../../utils/authUtils";
import { useParams } from "react-router-dom"; ////////////////////////
import { Box, Card, CardMedia, CardContent, Typography, Button, Grid, Rating, Divider, CircularProgress, Dialog, DialogTitle, DialogContent, IconButton, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import PeopleIcon from "@mui/icons-material/People";
import { getUserType, setTouristData } from "../../utils/authUtils";

const LoadHotels = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId1 = getUserId();
  const [currency, setCurrency] = useState("USD");
  const LazyCardMedia = lazy(() => import("@mui/material/CardMedia"));
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const checkInDate = queryParams.get("check_in_date");
  const checkOutDate = queryParams.get("check_out_date");
  const adults = queryParams.get("adults");
  const children = queryParams.get("children");
  const childrenAges = queryParams.get("children_ages");
  const userId = localStorage.getItem("userId");

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-CA");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency); // Set user's selected currency
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();

    const fetchHotels = async () => {
      setLoading(true);
      setError(null);

      try {
        let apiUrl = `http://localhost:8000/hotels/?check_in_date=${checkInDate}&check_out_date=${checkOutDate}&adults=${adults}`;
        if (children > 0) {
          const formattedChildrenAges = childrenAges ? childrenAges.split(",").join(",") : "";
          apiUrl += `&children=${children}&children_ages=${formattedChildrenAges}`;
        }

        const response = await axios.get(apiUrl);
        setHotels(response.data.Hotels);
      } catch (error) {
        console.error("Error fetching hotel data:", error);
        setError("Failed to load hotels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [checkInDate, checkOutDate, adults, children, id, userId1]);

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setCurrentImageIndex(0);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedHotel(null);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === selectedHotel.images.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? selectedHotel.images.length - 1 : prevIndex - 1));
  };
  const getValidImage = (images) => {
    for (let image of images) {
      // Check if the original_image property exists and is a valid URL
      if (image && image.original_image) {
        return image.original_image;
      }
    }
    // Return a placeholder URL if no valid image is found
    return null; // Fallback placeholder image
  };

  const exchangeRates = {
    USD: 1, // 1 EGP = 0.0204 USD (1 USD = 49 EGP)
    EUR: 0.93, // 1 EGP = 0.0192 EUR (1 EUR = 52 EGP)
    GBP: 0.77, // 1 EGP = 0.0159 GBP (1 GBP = 63 EGP)
    AUD: 1.52, // 1 EGP = 0.03125 AUD (1 AUD = 32 EGP)
    CAD: 1.39, // 1 EGP = 0.02857 CAD (1 CAD = 35 EGP)
    EGP: 49,
  };

  const formatCurrency = (amount) => {
    if (!currency) {
      return amount; // Fallback to amount if currency is not set
    }

    // Ensure amount is a number
    const value = Number(amount);

    // Convert amount from EGP to chosen currency if currency is EGP
    const convertedAmount = currency === "USD" ? value : value * exchangeRates[currency];

    // return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
    //   .format(convertedAmount);

    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(convertedAmount);

    return formattedAmount.replace(/(\D)(\d)/, "$1 $2");
  };
  const handleBookHotel = async () => {

    const currentDate = new Date().toISOString();
    const hotelDetails = `
    Hotel: ${selectedHotel.name}, 
    City: ${selectedHotel.city}, 
    Check-in Date: ${formatDate(checkInDate)}, 
    Check-out Date: ${formatDate(checkOutDate)}, 
    Adults: ${adults}, 
    Children: ${children}, 
    Total Price: ${selectedHotel.total_rate?.extracted_lowest * 49}
  `;

  
  navigate(`/tourist/payment/${selectedHotel.total_rate?.extracted_lowest * 49}/Hotel/${null}/${null}/${null}/${null}/${null}/${hotelDetails}`);
    // setBookingDialog(true);
    // const booking = { tourist: userId, price: selectedHotel.total_rate?.extracted_lowest * 49, type: "Hotel", details: hotelDetails };

    // setTouristData(booking);
    // try {
    //   setBookingLoading(true); // Start loading immediately
    //   await axios.post("http://localhost:8000/tourist/booking/create", {
    //     tourist: userId,
    //     price: selectedHotel.total_rate?.extracted_lowest * 49,
    //     type: "Hotel",
    //     details: hotelDetails,
    //   });
    //   setOpenModal(false);
    //   setBookingLoading(false);
    // } catch (error) {
    //   console.error("Error creating booking:", error);
    //   setError("Failed to create booking. Please try again.");
    //   setBookingLoading(false);
    // }
  };

  const closeBookingDialog = () => {
    setBookingDialog(false);
    setBookingLoading(false); // Set loading to false
    navigate("/tourist/homepage");
  };

  const sortedHotels = hotels.slice().sort((a, b) => {
    const classA = parseInt(a.hotel_class) || 0;
    const classB = parseInt(b.hotel_class) || 0;
    if (classA !== classB) return classB - classA;
    return (b.overall_rating || 0) - (a.overall_rating || 0);
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" flexDirection="column">
        <CircularProgress color="primary" size={50} />
        <Typography mt={2} fontWeight="bold">
          Finding best deals...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" align="center" fontWeight="bold" color="primary" sx={{ mb: 4, fontSize: "2rem", textShadow: "2px 2px #d3d3d3" }}>
        Here are the best accommodations in Egypt!
      </Typography>
      <Grid container spacing={4}>
        {sortedHotels.map((hotel, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                boxShadow: hotel.extracted_hotel_class >= 4 ? "0px 4px 12px rgba(255, 223, 0, 0.5)" : 4,
                borderRadius: 3,
                overflow: "hidden",
                transition: "transform 0.3s ease",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Box sx={{ position: "relative" }}>
                {hotel.images && hotel.images.find((img) => img.original_image) && (
                  <Suspense fallback={<CircularProgress />}>
                    <LazyCardMedia component="img" image={getValidImage(hotel.images)} alt={hotel.name} key={getValidImage(hotel.images)} sx={{ height: 180, width: "100%", objectFit: "cover" }} />
                  </Suspense>
                )}
                {hotel.city && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "rgba(0, 0, 0, 0.6)",
                      color: "white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{`${hotel.city}, Egypt`}</Typography>
                  </Box>
                )}
                {hotel.hotel_class && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      display: "flex",
                      alignItems: "center",
                      bgcolor: "#FFD700",
                      color: "black",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                    }}
                  >
                    <StarIcon sx={{ mr: 0.5, color: "black" }} fontSize="small" />
                    {hotel.hotel_class}
                  </Box>
                )}
              </Box>
              <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mt: 1 }}>
                    {hotel.name}
                  </Typography>
                  <Typography variant="overline" color="text.secondary">
                    {hotel.type}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(hotel.rate_per_night?.extracted_lowest || "N/A")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Per Night
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {formatCurrency(hotel.total_rate?.extracted_lowest || "N/A")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Rate
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Overall Rating:
                    </Typography>
                    <Rating name="overall-rating" value={hotel.overall_rating || 0} readOnly precision={0.5} />
                    <Typography variant="body2">{hotel.overall_rating || "N/A"}</Typography>
                  </Box>
                  {hotel.location_rating && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        Location Rating:
                      </Typography>
                      <Rating name="location-rating" value={hotel.location_rating} readOnly precision={0.5} sx={{ color: "purple" }} />
                      <Typography variant="body2">{hotel.location_rating}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 1, mt: 1 }}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const rating = hotel.ratings?.find((r) => r.stars === star);
                      return (
                        <Box
                          key={star}
                          sx={{
                            minWidth: "50px",
                            p: 1,
                            border: "1px solid",
                            borderColor: star === 5 ? "#a5d6a7" : star === 4 ? "#c5e1a5" : star === 3 ? "#ffe082" : star === 2 ? "#ffcc80" : "#ef9a9a",
                            borderRadius: 5,
                            backgroundColor: star === 5 ? "#e8f5e9" : star === 4 ? "#f1f8e9" : star === 3 ? "#fffde7" : star === 2 ? "#fff3e0" : "#ffebee",
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="caption" color="text.primary" fontWeight="bold">
                            {star}⭐
                          </Typography>

                          <Typography variant="caption" color="text.primary" sx={{ mt: 0.5 }}>
                            {rating ? rating.count : "N/A"}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1 }} onClick={() => handleViewDetails(hotel)}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Hotel Details */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {selectedHotel?.name || "Hotel Details"}
          </Typography>
          <IconButton onClick={handleCloseModal} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedHotel && (
            <Box>
              {/* Slideshow for images */}
              <Box sx={{ position: "relative", textAlign: "center", mb: 2 }}>
                <IconButton onClick={handlePreviousImage} sx={{ position: "absolute", left: 8, top: "50%", zIndex: 1 }}>
                  <ArrowBackIosIcon />
                </IconButton>
                <Box sx={{ display: "flex", overflowX: "hidden", maxWidth: "100%", scrollBehavior: "smooth" }}>
                  {selectedHotel.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image.original_image}
                      alt={`Hotel Image ${index + 1}`}
                      style={{
                        minWidth: "100%",
                        height: 220,
                        objectFit: "cover",
                        borderRadius: 8,
                        display: index === currentImageIndex ? "block" : "none",
                      }}
                    />
                  ))}
                </Box>
                <IconButton onClick={handleNextImage} sx={{ position: "absolute", right: 8, top: "50%", zIndex: 1 }}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>

              {/* Guests, Check-In, and Check-Out */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  textAlign: "center",
                  mb: 2,
                  gap: 1,
                }}
              >
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Guests
                  </Typography>
                  <Chip
                    label={`${adults || 0} Adults`}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      backgroundColor: "#e0f7fa",
                      color: "#00796b",
                      fontSize: "0.8rem",
                      mt: 0.5,
                    }}
                  />
                  {children > 0 && (
                    <Chip
                      label={`${children} Children`}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        backgroundColor: "#fff3e0",
                        color: "#ef6c00",
                        fontSize: "0.8rem",
                        mt: 0.5,
                      }}
                    />
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    Check-In
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ fontSize: "1rem" }}>
                    {checkInDate || "N/A"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    Check-Out
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ fontSize: "1rem" }}>
                    {checkOutDate || "N/A"}
                  </Typography>
                </Box>
              </Box>

              {/* Flexible Details Grid */}
              <Grid container spacing={1} sx={{ mb: 2 }}>
                {selectedHotel.essential_info?.length > 0 && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PeopleIcon sx={{ mr: 0.5, color: "primary.main" }} /> Info
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {selectedHotel.essential_info.map((info, idx) => (
                        <Chip key={idx} label={info} size="small" sx={{ borderRadius: 3 }} />
                      ))}
                    </Box>
                  </Grid>
                )}

                {selectedHotel.amenities?.length > 0 && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CheckIcon sx={{ mr: 0.5, color: "primary.main" }} /> Amenities
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {selectedHotel.amenities.map((amenity, idx) => (
                        <Chip key={idx} label={amenity} size="small" sx={{ backgroundColor: "#e3f2fd", color: "#0d47a1", borderRadius: 3 }} />
                      ))}
                    </Box>
                  </Grid>
                )}

                {selectedHotel.excluded_amenities?.length > 0 && (
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <BlockIcon sx={{ mr: 0.5, color: "error.main" }} /> Excluded
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {selectedHotel.excluded_amenities.map((excluded, idx) => (
                        <Chip key={idx} label={excluded} size="small" sx={{ backgroundColor: "#ffcdd2", color: "#c62828", borderRadius: 3 }} />
                      ))}
                    </Box>
                  </Grid>
                )}

                {selectedHotel.nearby_places?.length > 0 && (
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationOnIcon sx={{ mr: 0.5, color: "purple" }} /> Nearby Places
                    </Typography>
                    <Box>
                      {selectedHotel.nearby_places.map((place, idx) => (
                        <Box key={idx} sx={{ mb: 0.5 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {place.name}
                          </Typography>
                          {place.transportations?.map((transport, tIdx) => (
                            <Typography key={tIdx} variant="body2" color="text.secondary">
                              {transport.type} - {transport.duration}
                            </Typography>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* Total Price of Visit */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  border: "2px solid #e0e0e0",
                  borderRadius: 3,
                  backgroundColor: "#f5f5f5",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="primary">
                  Total Price of Visit
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="secondary">
                  {formatCurrency(selectedHotel.total_rate?.extracted_lowest || "N/A")}
                </Typography>
              </Box>

              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  bgcolor: "purple",
                  color: "#fff",
                  borderRadius: 3,
                  ":hover": { bgcolor: "#6a1b9a" },
                  width: "100%",
                  py: 1,
                }}
                onClick={handleBookHotel}
              >
                Book Now
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      {/* Booking Confirmation Dialog */}
      <Dialog open={bookingDialog} onClose={closeBookingDialog} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          {bookingLoading ? (
            // Show loading spinner while booking is processing
            <Box textAlign="center">
              <CircularProgress color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" fontWeight="bold" color="primary" mt={2}>
                Booking in progress...
              </Typography>
            </Box>
          ) : (
            // Confirmation message after booking completes
            <Box textAlign="center">
              <CheckCircleOutline color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                Booked
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Your booking has been successfully confirmed!
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary" mt={2}>
                {selectedHotel?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedHotel?.city}
              </Typography>
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} onClick={closeBookingDialog}>
                Return to Home
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default LoadHotels;
