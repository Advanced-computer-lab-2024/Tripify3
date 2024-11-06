import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, ShoppingCart, Favorite, Home, Hotel, Event, Flight, DirectionsRun, ListAlt, RoomService, HelpOutline } from "@mui/icons-material"; 
import { useNavigate, useLocation } from "react-router-dom";

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
    navigate("/tourist/tourist/account");
  };

  const handleHomeClick = () => {
    navigate("/tourist/tourist/homepage");
  };

  const handleCartClick = () => {
    navigate("/tourist/cart");
  };

  const hiddenRoutes = ["/tourist/tourist/account", "/tourist/tourist/wishlist"];
  const hideProfileAndWishlist = hiddenRoutes.includes(location.pathname);

  return (
    <>
      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#003366", zIndex: 1300 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
            Tripify
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Home Icon */}
            <IconButton color="inherit" sx={{ color: "#fff" }} onClick={handleHomeClick}>
              <Home />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Home
              </Typography>
            </IconButton>

            {!hideProfileAndWishlist && (
              <>
                <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleProfileClick}>
                  <AccountCircle />
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    My Profile
                  </Typography>
                </IconButton>

                <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }}>
                  <Favorite />
                  <Typography variant="body1" sx={{ ml: 1 }}>
                    My Wishlist
                  </Typography>
                </IconButton>
              </>
            )}

            {/* Services Icon with Dropdown */}
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleServicesClick}>
              <RoomService />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Services
              </Typography>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleServicesClose}>
              <MenuItem onClick={() => navigate("/hotels")}>Hotels</MenuItem>
              <MenuItem onClick={() => navigate("/search_flights")}>Flights</MenuItem>
            </Menu>

            {/* Help Icon with Dropdown */}
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleHelpClick}>
              <HelpOutline />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Help
              </Typography>
            </IconButton>
            <Menu anchorEl={helpAnchorEl} open={Boolean(helpAnchorEl)} onClose={handleHelpClose}>
              <MenuItem onClick={() => navigate("/tourist/file-complaint")}>File a Complaint</MenuItem>
            </Menu>

            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleCartClick}>
              <ShoppingCart />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Cart
              </Typography>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Bottom Navbar */}
      <AppBar position="fixed" sx={{ top: "56px", backgroundColor: "#00695C", zIndex: 1299 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
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
  );
};

export default TouristNavbar;
