import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, Typography, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const AdvertiserSidebar = () => {
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
        Advertiser Menu
      </Typography>

      <List>
       

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/advertiser/my-activities" sx={linkStyle}>
            My Activities
          </ListItemButton>
        </ListItem>


        {/* <ListItem disablePadding>
          <ListItemButton component={Link} to="/advertiser/products" sx={linkStyle}>
            Products
          </ListItemButton>
        </ListItem> */}

        <ListItem disablePadding>
        <ListItemButton component={Link} to="/advertiser/itineraries" sx={linkStyle}>
            Itineraries
          </ListItemButton>
        </ListItem>


        <ListItem disablePadding>
          <ListItemButton component={Link} to="/advertiser/historical-places" sx={linkStyle}>
            Historical Places
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/advertiser/salesReport" sx={linkStyle}>
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

export default AdvertiserSidebar;
