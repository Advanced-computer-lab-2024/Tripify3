import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  AccountCircle,
  ShoppingCart,
  Favorite,
  Home,
  Hotel,
  Event,
  Flight,
  DirectionsRun,
  ListAlt,
  RoomService,
  HelpOutline,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"; // Import icon

const TouristNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [helpAnchorEl, setHelpAnchorEl] = React.useState(null);
  
  const handleServicesClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleServicesClose = () => {
    setAnchorEl(null);
  };
  
  const handleHelpClick = (event) => {
    setHelpAnchorEl(event.currentTarget);
  };
  
  const handleHelpClose = () => {
    setHelpAnchorEl(null);
  };
  
  const handleProfileClick = () => {
    navigate("/tourist/profile");
  };
  
  const handleHomeClick = () => {
    navigate("/tourist/homepage");
  };
  
  const handleCartClick = () => {
    navigate("/tourist/cart");
  };
  
  const hiddenRoutes = ["/tourist/profile", "/tourist/wishlist"];
  const hideProfileAndWishlist = hiddenRoutes.includes(location.pathname);
  
  return (
    <>
      {/* Top Navbar */}
      <AppBar position="absolute" sx={{ backgroundColor: "#003366", zIndex: 1300 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
          Tripify
        </Typography>
        
        <Box sx={{ display: "flex", justifyContent: "center", flexGrow: 1 }}>
          <Box sx={{ display: "flex", gap: 5, alignItems: 'center' }}>
            <IconButton color="inherit" onClick={handleHomeClick}>
              <Home />
              <Typography variant="body1" sx={{ ml: 0.5 }}>Home</Typography>
            </IconButton>
            
            { (
              <>
                <IconButton color="inherit">
                  <Favorite />
                  <Typography variant="body1" sx={{ ml: 0.5 }}>My Wishlist</Typography>
                </IconButton>
              </>
            )}
            <IconButton color="inherit" onClick={handleServicesClick}>
              <RoomService />
              <Typography variant="body1" sx={{ ml: 0.5 }}>Services</Typography>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleServicesClose}>
              <MenuItem onClick={() => navigate("/hotels")}>Hotels</MenuItem>
              <MenuItem onClick={() => navigate("/search_flights")}>Flights</MenuItem>
            </Menu>
            <IconButton color="inherit" onClick={handleCartClick}>
              <ShoppingCart />
              <Typography variant="body1" sx={{ ml: 0.5 }}>Cart</Typography>
            </IconButton>
            <IconButton color="inherit" onClick={handleProfileClick}>
                  <AccountCircle />
                  <Typography variant="body1" sx={{ ml: 0.5 }}>My Account</Typography>
                </IconButton>
                <IconButton color="inherit" onClick={handleHelpClick}>
              <HelpOutline />
              <Typography variant="body1" sx={{ ml: 0.5 }}>Help</Typography>
            </IconButton>
            <Menu anchorEl={helpAnchorEl} open={Boolean(helpAnchorEl)} onClose={handleHelpClose}>
              <MenuItem onClick={() => navigate("/tourist/file-complaint")}>File a Complaint</MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
     {/* Bottom Navbar */}
     <AppBar position="fixed" sx={{ top: "56px", backgroundColor: "#00695C", zIndex: 1299 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton color="inherit" sx={{ color: "#fff" }}>
            <Hotel />
            <Typography variant="body1" sx={{ ml: 1 }}>
              Hotels
            </Typography>
          </IconButton>

          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/tourist/itineraries")}>
            <ListAlt />
            <Typography variant="body1" sx={{ ml: 1 }}>
              Itineraries
            </Typography>
          </IconButton>

          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/tourist/events")}>
            <Event />
            <Typography variant="body1" sx={{ ml: 1 }}>
              Events
            </Typography>
          </IconButton>

          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/tourist/historical-places")}>
            <AccountBalanceIcon /> {/* Use the AccountBalance icon */}
            <Typography variant="body1" sx={{ ml: 1 }}>
              Historical Places
            </Typography>
          </IconButton>

          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/tourist/activities")}>
            <DirectionsRun />
            <Typography variant="body1" sx={{ ml: 1 }}>
              Activities
            </Typography>
          </IconButton>

          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/search_flights")}>
            <Flight />
            <Typography variant="body1" sx={{ ml: 1 }}>
              Flights
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
</>
  )
};

export default TouristNavbar;