import React, { useState } from "react";
import axios from "axios";  // Import axios
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Alert, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import backgroundImage from "../../../assets/logo.jpeg"; // Import your image

const EmailInput = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear the previous error message

    try {
        const response = await axios.post("http://localhost:8000/user/sendVerificationCode", 
        { email });  // Use axios to send a POST request with the email
  
        if (response.status === 200) {
          navigate("/verify-code", { state: { email } }); // Pass email instead of username
        } 
      } catch (error) {
        console.error("Error:", error);
        if (error.response) {
          setErrorMessage(error.response.data.message); // Handle server-side errors
        } else {
          setErrorMessage("An error occurred. Please try again later."); // Handle network or other errors
        }
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
            {" "}
            {/* Increased maxWidth for larger form area */}
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "black" }}>
              Forgot Password?
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ marginBottom: "30px" }}>
              Don't worry! It occurs. Please enter the email linked with your account.
            </Typography>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                type="email" // Added email input type for validation
              />
              <Button fullWidth type="submit" variant="contained" color="primary" sx={{ marginTop: "20px", backgroundColor: "#00695C" }}>
                Next
              </Button>
            </form>
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

export default EmailInput;
