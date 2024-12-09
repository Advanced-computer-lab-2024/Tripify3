import React from "react";
import { Box, Typography, Button, Card, CardContent, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/tourist/homepage");
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="90vh"
      bgcolor="#e8f5e9"
      px={2} // Add some padding for responsiveness
    >
      <Card
        sx={{
          maxWidth: 500,
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.12)",
          textAlign: "center",
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <Typography variant="h3" sx={{ fontSize: "2.5rem", fontWeight: 600 }}>
              🎉 Payment Successful! 🎉
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
            Thank you for your payment! Your transaction is complete. 🛒
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ mb: 3, lineHeight: 1.6 }}
          >
            🌟 Your order is being processed. You will receive a confirmation email shortly. For further assistance, feel free to reach out to our support team. 
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              fontSize: "5rem",
              mb: 3,
              color: "#4caf50", // Success green
            }}
          >
            ✅
          </Box>
          <Button
            variant="contained"
            color="success"
            onClick={handleGoHome}
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
          >
            🏠 Go to Homepage
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentSuccess;
