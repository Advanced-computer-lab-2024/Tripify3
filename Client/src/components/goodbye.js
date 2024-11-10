import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Goodbye = () => {
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    navigate("/"); // Redirects to the homepage or landing page
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h3" sx={{ mb: 2, color: "#333" }}>
        Goodbye! 👋
      </Typography>
      <Typography variant="h6" sx={{ mb: 4, color: "#666" }}>
        We’re sad to see you go. Thank you for being a part of Tripify.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleHomeRedirect}
        sx={{ mt: 2 }}
      >
        Return to Signup Page
      </Button>
      <Typography variant="body2" sx={{ mt: 4, color: "#999" }}>
        If you have any feedback or would like to share your experience, feel free to reach out.
      </Typography>
    </Box>
  );
};

export default Goodbye;
