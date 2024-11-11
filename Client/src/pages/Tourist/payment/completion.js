// Completion.js
import React from "react";
import { Typography, Box } from "@mui/material";

function Completion() {
  return (
    <Box sx={{ padding: 3, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Thank you! 🎉
      </Typography>
      <Typography variant="body1">Your payment was successful.</Typography>
    </Box>
  );
}

export default Completion;
