import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, Typography, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const TourismGovernorSidebar = () => {
  const [showItineraries, setShowItineraries] = useState(false);

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
        Tourist Menu
      </Typography>

      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/tourist/home" sx={linkStyle}>
            Home
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/tourist/activities" sx={linkStyle}>
            Activities
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setShowItineraries(!showItineraries)} sx={linkStyle}>
            Itineraries
            {showItineraries ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={showItineraries} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton component={Link} to="/tourist/itineraries" sx={subLinkStyle}>
                All Itineraries
              </ListItemButton>
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton component={Link} to="/tourist/itineraries/my" sx={subLinkStyle}>
                Booked Itineraries
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/tourist/historical-places" sx={linkStyle}>
            Historical Places
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton component={Link} to="/tourist/reviews" sx={linkStyle}>
            Reviews
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

export default TourismGovernorSidebar;
