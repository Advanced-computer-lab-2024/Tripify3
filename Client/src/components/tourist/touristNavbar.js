import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
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
  Settings
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const TouristNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleServicesClick = (event) => setAnchorEl(event.currentTarget);
  const handleServicesClose = () => setAnchorEl(null);
  const handleHelpClick = (event) => setHelpAnchorEl(event.currentTarget);
  const handleHelpClose = () => setHelpAnchorEl(null);
  const handleSettingsClick = (event) => setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
    setSettingsAnchorEl(null);
  };
  const closeDeleteDialog = () => setDeleteDialogOpen(false);

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
    setSettingsAnchorEl(null);
  };
  const closeLogoutDialog = () => setLogoutDialogOpen(false);

  const confirmDeleteAccount = () => {
    // Add delete account logic here
    setDeleteDialogOpen(false);
    navigate("/goodbye"); // Redirect after account deletion
  };

  const confirmLogout = () => {
    // Add logout logic here
    setLogoutDialogOpen(false);
    navigate("/login"); // Redirect to login page after logout
  };

  const handleProfileClick = () => navigate("/tourist/profile");
  const handleHomeClick = () => navigate("/tourist/homepage");
  const handleCartClick = () => navigate("/tourist/cart");

  const hiddenRoutes = ["/tourist/profile", "/tourist/wishlist"];
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
              <Typography variant="body1" sx={{ ml: 1 }}>Home</Typography>
            </IconButton>

            {!hideProfileAndWishlist && (
              <>
                <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleProfileClick}>
                  <AccountCircle />
                  <Typography variant="body1" sx={{ ml: 1 }}>My Account</Typography>
                </IconButton>

                <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }}>
                  <Favorite />
                  <Typography variant="body1" sx={{ ml: 1 }}>My Wishlist</Typography>
                </IconButton>
              </>
            )}

            {/* Services Icon with Dropdown */}
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleServicesClick}>
              <RoomService />
              <Typography variant="body1" sx={{ ml: 1 }}>Services</Typography>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleServicesClose}>
              <MenuItem onClick={() => navigate("/hotels")}>Hotels</MenuItem>
              <MenuItem onClick={() => navigate("/search_flights")}>Flights</MenuItem>
            </Menu>

            {/* Help Icon with Dropdown */}
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleHelpClick}>
              <HelpOutline />
              <Typography variant="body1" sx={{ ml: 1 }}>Help</Typography>
            </IconButton>
            <Menu anchorEl={helpAnchorEl} open={Boolean(helpAnchorEl)} onClose={handleHelpClose}>
              <MenuItem onClick={() => navigate("/tourist/file-complaint")}>File a Complaint</MenuItem>
            </Menu>

            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleCartClick}>
              <ShoppingCart />
              <Typography variant="body1" sx={{ ml: 1 }}>Cart</Typography>
            </IconButton>

            {/* Settings Icon with Dropdown */}
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleSettingsClick}>
              <Settings />
              <Typography variant="body1" sx={{ ml: 1 }}>Settings</Typography>
            </IconButton>
            <Menu anchorEl={settingsAnchorEl} open={Boolean(settingsAnchorEl)} onClose={handleSettingsClose}>
              <MenuItem onClick={() => navigate("/tourist/change-password")}>Change Password</MenuItem>
              <MenuItem onClick={openLogoutDialog}>Logout</MenuItem>
              <MenuItem onClick={openDeleteDialog} sx={{ color: "red" }}>Delete Account</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} variant="outlined" sx={{ color: "gray", borderColor: "gray", ":hover": { backgroundColor: "#F5F5F5", borderColor: "gray" } }}>Cancel</Button>
          <Button onClick={confirmDeleteAccount} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={closeLogoutDialog}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to logout?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} variant="outlined" sx={{ color: "gray", borderColor: "gray", ":hover": { backgroundColor: "#F5F5F5", borderColor: "gray" } }}>Cancel</Button>
          <Button onClick={confirmLogout} color="primary" variant="contained">Logout</Button>
        </DialogActions>
      </Dialog>

      {/* Bottom Navbar */}
      <AppBar position="fixed" sx={{ top: "56px", backgroundColor: "#00695C", zIndex: 1299 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton color="inherit" sx={{ color: "#fff" }}><Hotel /><Typography variant="body1" sx={{ ml: 1 }}>Hotels</Typography></IconButton>
          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/tourist/itineraries")}><ListAlt /><Typography variant="body1" sx={{ ml: 1 }}>Itineraries</Typography></IconButton>
          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/tourist/events")}><Event /><Typography variant="body1" sx={{ ml: 1 }}>Events</Typography></IconButton>
          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/tourist/historical-places")}><AccountBalanceIcon /><Typography variant="body1" sx={{ ml: 1 }}>Historical Places</Typography></IconButton>
          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/tourist/activities")}><DirectionsRun /><Typography variant="body1" sx={{ ml: 1 }}>Activities</Typography></IconButton>
          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/search_flights")}><Flight /><Typography variant="body1" sx={{ ml: 1 }}>Flights</Typography></IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TouristNavbar;