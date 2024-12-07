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
      <Typography variant="h6" sx={{ mt:8, mb: 3, fontWeight: "bold", color: "#fff" }}>
        Seller Menu
      </Typography>

      <List>
      
     
        <ListItem disablePadding>
        <ListItemButton component={Link} to="/seller/my-products" sx={linkStyle}>
           My Products
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
        <ListItemButton component={Link} to="/seller/salesReport" sx={linkStyle}>
           Sales Report
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
