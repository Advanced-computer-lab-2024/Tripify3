import { getUserId } from "../../utils/authUtils";
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
  const [showPastOrders, setShowPastOrders] = useState(true);

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
        order: orderId
      });
      alert(`Rated ${rating} star(s) successfully!`);
    } catch (error) {
      console.error("Error submitting rating:", error);
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
          <strong>💵 Payment Status:</strong> {order.paymentStatus}
        </Typography>
        <Typography variant="body1" sx={{ color: "#4caf50", fontSize: 18 }}>
          <strong>💲 Total Price:</strong> ${order.cart.totalPrice}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {order.cart.products.map((productItem) => (
            <ProductCard key={productItem.product._id} productItem={productItem} showPastOrders={showPastOrders}  onRate={(productId, rating) => handleRating(productId, rating, order._id)}  />
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const ProductCard = ({ productItem, showPastOrders, onRate }) => {
    const [imageIndex, setImageIndex] = useState(0);
    const [rating, setRating] = useState(0);
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
              <strong>Price:</strong> ${productItem.product.price}
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
      <Box display="flex" flexDirection="column" alignItems="center" sx={{ my: 4 }}>
        <Typography variant="h4" sx={{ color: "#3f51b5", mb: 2 }}>
          Your Orders
        </Typography>
        <Box width="100%" textAlign="center">
          <OrderSlider
            value={showPastOrders ? 0 : 1}
            min={0}
            max={1}
            step={1}
            onChange={handleSliderChange}
            marks={[
              { value: 0, label: "Past Orders" },
              { value: 1, label: "Upcoming Orders" },
            ]}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {showPastOrders ? orders.pastOrders.map((order) => <OrderCard key={order._id} order={order} />) : orders.upcomingOrders.map((order) => <OrderCard key={order._id} order={order} />)}
      </Box>
    </Container>
  );
};

export default OrdersPage;
