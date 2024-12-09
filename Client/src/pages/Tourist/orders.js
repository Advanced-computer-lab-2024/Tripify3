import { getUserId, getUserType } from "../../utils/authUtils";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Card, CardContent, CardMedia, Typography, Grid, Slider, Container, IconButton, Rating } from "@mui/material";
import { styled } from "@mui/system";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarIcon from "@mui/icons-material/Star";

const OrderSlider = styled(Slider)({
  width: "100px",
  height: "8px",
  color: "#3f51b5",
  "& .MuiSlider-thumb": {
    height: "20px",
    width: "20px",
  },
});

const OrdersPage = () => {
  const userId = getUserId();
  const [orders, setOrders] = useState({ pastOrders: [], upcomingOrders: [] });
  const [showPastOrders, setShowPastOrders] = useState(false);
  const [currency, setCurrency] = useState("USD"); // Default currency

  const exchangeRates = {
    USD: 1 / 49, // 1 EGP = 0.0204 USD (1 USD = 49 EGP)
    EUR: 1 / 52, // 1 EGP = 0.0192 EUR (1 EUR = 52 EGP)
    GBP: 1 / 63, // 1 EGP = 0.0159 GBP (1 GBP = 63 EGP)
    AUD: 1 / 32, // 1 EGP = 0.03125 AUD (1 AUD = 32 EGP)
    CAD: 1 / 35, // 1 EGP = 0.02857 CAD (1 CAD = 35 EGP)
    // Add other currencies as needed
  };

  const formatCurrency = (amount) => {
    if (!currency) {
      return amount; // Fallback to amount if currency is not set
    }
    const value = Number(amount);
    // Check user type and apply currency logic
    if (getUserType() !== "Tourist") {
      // If user is not Tourist, format amount in EGP
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(value);
    }

    // Convert amount from EGP to chosen currency if currency is EGP
    const convertedAmount = currency === "EGP" ? value : value * exchangeRates[currency];

    // return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
    //   .format(convertedAmount);

    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(convertedAmount);

    return formattedAmount.replace(/(\D)(\d)/, "$1 $2");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tourist/get/orders/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [userId]);

  const handleSliderChange = (event, newValue) => {
    setShowPastOrders(newValue === 0);
  };

  const handleRating = async (productId, rating, orderId) => {
    try {
      await axios.post(`http://localhost:8000/tourist/review`, {
        tourist: userId,
        product: productId,
        rating: rating,
        order: orderId,
      });
      alert(`Rated ${rating} star(s) successfully!`);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleCancelOrder = (orderId) => async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/tourist/delete/order/${userId}/${orderId}`);
      if (response.status === 200) {
        alert("Order cancelled successfully!");
        // Remove the cancelled order from the state
        setOrders((prevOrders) => ({
          ...prevOrders,
          upcomingOrders: prevOrders.upcomingOrders.filter((order) => order._id !== orderId),
        }));
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel the order. Please try again.");
    }
  };
  

  const OrderCard = ({ order }) => (
    <Card variant="outlined" sx={{ bgcolor: "#f1f8ff", my: 2, width: "100%" }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {showPastOrders ? "🕒 Past Order" : "🚀 Upcoming Order"}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: 18 }}>
          <strong>📍 Drop-Off Location:</strong> {order.dropOffLocation}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: 18 }}>
          <strong>📅 Drop-Off Date:</strong> {new Date(order.dropOffDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" sx={{ fontSize: 18 }}>
          <strong>💳 Payment Status:</strong> {order.paymentStatus}
        </Typography>
        {order.cart.promoCode !== 0 && (
          <Typography variant="body1" sx={{ fontSize: 18 }}>
            <strong>🎁 Discount:</strong> {order.cart.promoCode * 100}%
          </Typography>
        )}

        <Typography variant="body1" sx={{ color: "#4caf50", fontSize: 18 }}>
          <strong>🚚 Delivery Fee:</strong> {order.deliveryFee} EGP
        </Typography>
        <Typography variant="body1" sx={{ color: "#4caf50", fontSize: 18 }}>
          <strong>🛒 Total Price:</strong> {order.cart.totalPrice * (1 - order.cart.promoCode) + order.deliveryFee} EGP
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {order.cart.products.map((productItem) => (
            <ProductCard key={productItem.product._id} productItem={productItem} showPastOrders={showPastOrders} onRate={(productId, rating) => handleRating(productId, rating, order._id)} />
          ))}
        </Grid>

        {!showPastOrders && (
  <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
    <button
      onClick={handleCancelOrder(order._id)}
      style={{
        padding: "10px 20px",
        backgroundColor: "#f44336",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Cancel Order
    </button>
  </Box>
)}

      </CardContent>
    </Card>
  );

  const ProductCard = ({ productItem, showPastOrders, onRate }) => {
    const [imageIndex, setImageIndex] = useState(0);
    const [rating, setRating] = useState(productItem.touristRating || 0); // Initialize rating with touristRating

    const images = productItem.product.imageUrl.map((url) => {
      const filename = url.split("\\").pop();
      return `http://localhost:8000/uploads/${productItem.product.sellerId}/${filename}`;
    });

    const handleNextImage = () => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevImage = () => {
      setImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleStarClick = (newRating) => {
      setRating(newRating);
      onRate(productItem.product._id, newRating);
    };

    return (
      <Grid item xs={12} key={productItem.product._id}>
        <Card sx={{ display: "flex", height: "auto", mb: 2 }}>
          <Box sx={{ width: "20%", position: "relative" }}>
            {images.map((image, index) => (
              <CardMedia
                component="img"
                key={index}
                image={image}
                alt={productItem.product.name}
                sx={{
                  display: index === imageIndex ? "block" : "none",
                  height: 150, // Reduced height for better fit
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            ))}
            {images.length > 1 && (
              <>
                <IconButton sx={{ position: "absolute", top: "50%", left: 0 }} onClick={handlePrevImage}>
                  <ArrowBackIosIcon />
                </IconButton>
                <IconButton sx={{ position: "absolute", top: "50%", right: 0 }} onClick={handleNextImage}>
                  <ArrowForwardIosIcon />
                </IconButton>
              </>
            )}
          </Box>

          <CardContent sx={{ width: "60%", padding: 2 }}>
            <Typography variant="subtitle1" sx={{ color: "#1e88e5", fontSize: 20 }}>
              {productItem.product.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: 16 }}>
              {productItem.product.details}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 18 }}>
              <strong>Price:</strong> {productItem.product.price} EGP
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 18 }}>
              <strong>Quantity:</strong> {productItem.quantity}
            </Typography>
            {showPastOrders && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <Typography variant="body1" sx={{ fontSize: 18, mr: 1 }}>
                  Rate this product:
                </Typography>
                <Rating
                  name={`product-rating-${productItem.product._id}`}
                  value={rating}
                  onChange={(event, newValue) => handleStarClick(newValue)}
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.3 }} />}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Container>
       <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    sx={{ my: 4, textAlign: "center" }}
  >
    {/* Modern title with gradient */}
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        background: "linear-gradient(90deg, #3f51b5, #2196f3)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        mb: 3,
      }}
    >
      Your Orders
    </Typography>

    {/* Toggle buttons with modern design */}
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        borderRadius: 2,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        bgcolor: "#f9f9f9",
        p: 1,
        width: "fit-content",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          cursor: "pointer",
          px: 2,
          py: 1,
          borderRadius: 2,
          fontWeight: "500",
          transition: "background-color 0.3s, color 0.3s",
          bgcolor: showPastOrders ? "#3f51b5" : "transparent",
          color: showPastOrders ? "#fff" : "#3f51b5",
          "&:hover": {
            bgcolor: showPastOrders ? "#2c387e" : "#e3f2fd",
          },
        }}
        onClick={() => setShowPastOrders(true)}
      >
        Past Orders
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          cursor: "pointer",
          px: 2,
          py: 1,
          borderRadius: 2,
          fontWeight: "500",
          transition: "background-color 0.3s, color 0.3s",
          bgcolor: !showPastOrders ? "#3f51b5" : "transparent",
          color: !showPastOrders ? "#fff" : "#3f51b5",
          "&:hover": {
            bgcolor: !showPastOrders ? "#2c387e" : "#e3f2fd",
          },
        }}
        onClick={() => setShowPastOrders(false)}
      >
        Upcoming Orders
      </Typography>
    </Box>
  </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {showPastOrders ? orders.pastOrders.map((order) => <OrderCard key={order._id} order={order} />) : orders.upcomingOrders.map((order) => <OrderCard key={order._id} order={order} />)}
      </Box>
    </Container>
  );
};

export default OrdersPage;
