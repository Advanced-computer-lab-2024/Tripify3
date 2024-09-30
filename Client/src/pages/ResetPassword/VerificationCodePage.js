import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import backgroundImage from "../../assets/signup/CarouselLogin3.png"; // Import your image

const VerificationCode = () => {
  const { state } = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const username = state.username;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error message

    try {
      const response = await fetch(
        "http://localhost:8000/access/user/verifyVerificationCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, verificationCode }),
        }
      );

      if (response.status === 200) {
        navigate("/new-password", { state: { username } }); // Navigate to new password page
      } else {
        setErrorMessage("Incorrect or invalid verification code. Please try again."); // Set error message
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again later."); // Set error for network issues
    }
  };

  // Function to resend the verification code
  const handleResendCode = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/access/user/sendVerificationCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (response.status === 200) {
        alert("Verification code resent!");
      } else {
        alert("Failed to resend code. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while resending the code.");
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Centered Card with Form and Image */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "80%", // Increased the card width
          height: "80vh", // Increased the card height
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "20px", // Adjusted the border radius for a smoother look
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)", // Increased shadow for a better card effect
          textAlign: "center",
          position: "relative", // Enable positioning for absolute children
        }}
      >
        {/* Back Arrow positioned at the top left of the card */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: "20px", // Position from the top
            left: "20px", // Position from the left
            color: "#00695C", // Changed arrow color
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Left Side - Form */}
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
          }}
        >
          {/* Form Content */}
          <Box sx={{ width: "100%", maxWidth: "500px" }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "black" }}
            >
              OTP Verification
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ marginBottom: "30px" }}>
              Enter the verification code we just sent on your email address.
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Verification Code"
                variant="outlined"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                margin="normal"
                required
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginTop: "20px", backgroundColor: "#00695C" }}
              >
                Verify
              </Button>
            </form>

            {/* Resend Code Link */}
            <Typography
              variant="body2"
              sx={{ marginTop: "10px", cursor: "pointer", color: "#00695C" }}
              onClick={handleResendCode}
            >
              Didn't get code? <span style={{ textDecoration: 'underline' }}>Resend</span>
            </Typography>
          </Box>
        </Box>

        {/* Right Side - Image inside the card */}
        <Box
          sx={{
            width: "50%",
            backgroundImage: `url(${backgroundImage})`, // Use the imported image
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "20px", // Match card's border radius
          }}
        />
      </Box>
    </Container>
  );
};

export default VerificationCode;
