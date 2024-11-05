import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, List, ListItem, ListItemButton, Typography, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const TourismGovernorSidebar = () => {
  const [showItineraries, setShowItineraries] = useState(false);
  const location = useLocation();




  // Conditionally render the sidebar based on the current route
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
          <ListItemButton onClick={() => setShowItineraries(!showItineraries)} sx={linkStyle}>
            Bookings
            {showItineraries ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        <Collapse in={showItineraries} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton component={Link} to="/tourist/itineraries" sx={subLinkStyle}>
               Itineraries
              </ListItemButton>
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemButton component={Link} to="/tourist/itineraries/" sx={subLinkStyle}>
                Activities
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/tourism-governor/historical-places" sx={linkStyle}>
            My Places
          </ListItemButton>
        </ListItem>
      
        
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/tourism-governor/tags" sx={linkStyle}>
            Tags
          </ListItemButton>
        </ListItem>
      
        
        

      </List>
    </Box>
  ); // Return null if the sidebar should not be visible
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

export default TourismGovernorSidebar;
