import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, Typography, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const TourGuideSidebar = () => {
  const [showServices, setShowServices] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const toggleServices = () => {
    setShowServices((prev) => !prev);
  };

  const toggleAnalytics = () => {
    setShowAnalytics((prev) => !prev);
  };

  return (
    <Box
      sx={{
        width: 240,
        backgroundColor: "#003366",
        padding: 2,
        color: "#fff",
        height: "100vh",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold", color: "#fff" }}>
        TourGuide Menu
      </Typography>

      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/tour-guide/home" sx={linkStyle}>
            Home
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/tour-guide/itinerary" sx={linkStyle}>
            My Itineraries
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/tour-guide/activities" sx={linkStyle}>
            All Activities
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/tour-guide/historical-places" sx={linkStyle}>
            All Historical Places
          </ListItemButton>
        </ListItem>

    
      </List>
    </Box>
  );
};

const linkStyle = {
  color: "#fff",
  padding: "10px",
  fontSize: "16px",
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

export default TourGuideSidebar;
