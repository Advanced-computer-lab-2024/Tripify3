// LoyaltyPoints.js
import React from "react";
import { Card, CardContent, CardHeader, Box, Typography, Button } from "@mui/material";
import { FaCoins } from "react-icons/fa"; 

const LoyaltyPoints = ({ points, onRedeem }) => {
  return (
    <Card sx={{ marginBottom: 4, borderRadius: "10px", padding: 2 }}>
      <CardHeader title="Loyalty Points" titleTypographyProps={{ variant: "h6" }} />
      <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#E3F2FD",
            borderRadius: "2px",
            padding: "10px 20px",
          }}
        >
          <FaCoins size={24} color="#1976d2" style={{ marginRight: "10px" }} />
          <Typography variant="body1" sx={{ color: "#1976d2", fontWeight: "bold" }}>
            {points} Points
          </Typography>
        </Box>
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderColor: "#1976d2",
            color: "#1976d2",
            borderRadius: "20px",
            padding: "8px 16px",
            marginLeft: 2,
            transition: "background-color 0.3s", 
            "&:hover": {
              backgroundColor: "#1976D2", 
              color: "#fff", 
            },
          }}
          onClick={onRedeem}
        >
          Redeem
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoyaltyPoints;
