import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Alert, IconButton } from "@mui/material";
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
      const response = await fetch("http://localhost:8000/access/user/verifyVerificationCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, verificationCode }),
      });

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
      const response = await fetch("http://localhost:8000/access/user/resendVerificationCode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (response.status === 200) {
        alert("Verification code resent!"); // Notify user
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

        {/* Form Section */}
        <Box
          sx={{
            width: "100%", // Use full width for the form
            maxWidth: "500px", // Max width for the form area
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "black" }}>
            Enter Verification Code
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "20px", color: "gray" }}>
            Please enter the 6-digit code sent to your email.
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField fullWidth label="6-digit code" variant="outlined" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} margin="normal" required />
            <Button fullWidth type="submit" variant="contained" color="primary" sx={{ marginTop: "20px", backgroundColor: "#00695C" }}>
              Submit
            </Button>
          </form>
          <Typography
            variant="body2"
            sx={{ marginTop: "20px", cursor: "pointer", color: "#00695C" }}
            onClick={handleResendCode} // Call the resend function
          >
            Did not get code? Resend
          </Typography>
        </Box>

        {/* Image Section */}
        <Box
          component="img"
          src={backgroundImage} // Replace with your image path
          alt="Verification Illustration"
          sx={{
            width: '50%',
            height: "auto", // Keep aspect ratio
            marginLeft: "20px", // Add some space between the form and the image
          }}
        />
      </Box>
    </Container>
  );
};

export default VerificationCode;
