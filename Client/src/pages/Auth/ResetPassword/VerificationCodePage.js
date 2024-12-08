import React, { useState, useEffect } from "react";
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
import backgroundImage from "../../../assets/logo.jpeg"; // Import your image

const VerificationCode = () => {
  const { state } = useLocation();
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(30); // Initialize timer to 30 seconds
  const navigate = useNavigate();
  const email = state.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error message

    try {
      const response = await fetch(
        "http://localhost:8000/user/verifyVerificationCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, verificationCode }),
        }
      );

      if (response.status === 200) {
        navigate("/new-password", { state: { email } }); // Navigate to new password page
      } else {
        setErrorMessage("Incorrect or invalid verification code. Please try again."); // Set error message
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again later."); // Set error for network issues
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/user/sendVerificationCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.status === 200) {
        alert("Verification code resent!");
        setTimer(30); // Restart a 30-second countdown after resending the code
      } else {
        alert("Failed to resend code. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while resending the code.");
    }
  };

  // Countdown effect for the resend timer
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      // Cleanup interval on component unmount or when timer reaches 0
      return () => clearInterval(intervalId);
    }
  }, [timer]);

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
              sx={{
                marginTop: "10px",
                cursor: timer === 0 ? "pointer" : "not-allowed",
                color: timer === 0 ? "#00695C" : "#999",
              }}
              onClick={timer === 0 ? handleResendCode : null} // Only trigger if timer is 0
            >
              {timer === 0 ? (
                "Didn't get code? Resend"
              ) : (
                `Resend available in ${timer} seconds`
              )}
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
