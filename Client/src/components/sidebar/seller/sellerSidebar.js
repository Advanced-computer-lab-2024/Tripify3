import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, Typography, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const SellerSidebar = () => {
  const [showItineraries, setShowItineraries] = useState(false);

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: "#003366", // Dark blue background
        padding: 2,
        color: "#fff",
        height: "100vh",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color: "#fff" }}>
        Tourist Menu
      </Typography>

      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/seller/seller" sx={linkStyle}>
            Home
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/seller/activities" sx={linkStyle}>
            Activities
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
        <ListItemButton component={Link} to="/seller/itineraries" sx={linkStyle}>
            Itineraries
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
        <ListItemButton component={Link} to="/seller/historical-places" sx={linkStyle}>
            Historical Places
          </ListItemButton>
        </ListItem>

       
        
      </List>
    </Box>
  );
};

const linkStyle = {
  color: "#fff",
  padding: "10px",
  fontSize: "16px", // Increase font size
  "&:hover": {
    backgroundColor: "#00509e",
  },
};

const subLinkStyle = {
  color: "#fff",
  padding: "8px",
  fontSize: "14px",
  "&:hover": {
    backgroundColor: "#00509e",
  },
};

export default SellerSidebar;
