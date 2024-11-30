import React from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page or desired route
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f0f4f8"
    >
      <Card
        style={{
          maxWidth: 500,
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent style={{ textAlign: "center" }}>
          <Typography variant="h3" gutterBottom>
            🎉 Payment Successful! 🎉
          </Typography>
          <Typography variant="h6" gutterBottom color="textSecondary">
            Thank you for your purchase. Your transaction was completed
            successfully.
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            style={{ margin: "20px 0", lineHeight: "1.6" }}
          >
            Sit back and relax while we process your order. If you have any
            questions, feel free to contact us.
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            style={{
              fontSize: "80px",
              margin: "20px 0",
            }}
          >
            ✅
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGoHome}
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "10px",
            }}
          >
            Go to Homepage
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentSuccess;
