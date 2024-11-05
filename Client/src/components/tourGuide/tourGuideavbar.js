import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { AccountCircle, ShoppingCart, Favorite, Home, Hotel, Event, Flight, DirectionsRun, ListAlt, RoomService, HelpOutline } from "@mui/icons-material"; 
import { useNavigate, useLocation } from "react-router-dom";

const TourGuideNavbar = () => {
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
    navigate("/tour-guide/profile");
  };

  const handleHomeClick = () => {
    navigate("/tour-guide/homepage");
  };

  const handleCartClick = () => {
    navigate("/tourist/cart");
  };

  const hiddenRoutes = ["/tourist/account", "/tourist/wishlist"];
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
                    My Account
                  </Typography>
                </IconButton>

                
              </>
            )}

           

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

            
          </Box>
        </Toolbar>
      </AppBar>

    </>
  );
};

export default TourGuideNavbar;
