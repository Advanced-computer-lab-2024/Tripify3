import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import {
  AccountCircle,
  ShoppingCart,
  Favorite,
  Home,
  Event,
  DirectionsRun,
  ListAlt,
  RoomService,
  HelpOutline,
  Settings,
  LocalDining, // Added icon for Orders
  MonetizationOn, // Added icon for Payments
  CardGiftcard, // Added icon for Gift Cards
} from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Report from "@mui/icons-material/Report"; // Add this import for the complaint icon
import Hotel from "@mui/icons-material/Hotel"; // For Hotels
import Flight from "@mui/icons-material/Flight"; // For Flights
import Assignment from "@mui/icons-material/Assignment"; // Add this import for the new icon
import LockOpen from "@mui/icons-material/LockOpen"; // For Forget Password
import Delete from "@mui/icons-material/Delete"; // For Delete Account
import ExitToApp from "@mui/icons-material/ExitToApp"; // For Logout
import ReportProblemIcon from "@mui/icons-material/ReportProblem"; // Import the complaint icon

import { useNavigate, useLocation } from "react-router-dom";
import { clearUser } from "../../utils/authUtils";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null); // New state for Account dropdown
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleSettingsClick = (event) => setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);
  const handleAccountClick = (event) => setAccountAnchorEl(event.currentTarget); // New handler for Account dropdown
  const handleAccountClose = () => setAccountAnchorEl(null); // Close Account dropdown

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

  const confirmDeleteAccount = async () => {
    try {
      // API call to delete the user account
      const response = await fetch(`http://localhost:8000/users/delete/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Handle successful deletion
        //alert('Account successfully deleted.');
        setDeleteDialogOpen(false); // Close the delete confirmation dialog
        navigate("/goodbye"); // Redirect after account deletion
      } else {
        // Handle errors
        const errorData = await response.json();
        alert(`Failed to delete account: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const confirmLogout = () => {
    // Add logout logic here
    setLogoutDialogOpen(false);
    clearUser();
    navigate("/login"); // Redirect to login page after logout
  };

  const handleProfileClick = () => navigate("/tourist/profile");
  const handleHomeClick = () => navigate("/tourist/homepage");
  const handleCartClick = () => navigate("/tourist/cart");
  const handleOrdersClick = () => navigate("/tourist/orders");
  const handlePaymentsClick = () => navigate("/tourist/payments");
  const handleBookingsClick = () => navigate("/tourist/bookings");
  const handleWishlistClick = () => navigate("/tourist/wishlist");
  const handleGiftCardsClick = () => navigate("/tourist/gift-cards");
  const handleComplaintsClick = () => navigate("/tourist/view/complaints/");

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
              <Typography variant="body1" sx={{ ml: 1 }}>
                Home
              </Typography>
            </IconButton>

            {/* Account Icon with Dropdown */}
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleAccountClick}>
              <AccountCircle />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Account
              </Typography>
            </IconButton>
            <Menu anchorEl={accountAnchorEl} open={Boolean(accountAnchorEl)} onClose={handleAccountClose}>
              <MenuItem onClick={handleProfileClick}>
                <AccountCircle sx={{ mr: 1 }} /> My Profile
              </MenuItem>
            </Menu>

            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleCartClick}>
              <ShoppingCart />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Cart
              </Typography>
            </IconButton>

            {/* Settings Icon with Dropdown */}
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleSettingsClick}>
              <Settings />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Settings
              </Typography>
            </IconButton>
            <Menu anchorEl={settingsAnchorEl} open={Boolean(settingsAnchorEl)} onClose={handleSettingsClose}>
              <MenuItem onClick={() => navigate("/tourist/change-password")}>
                <LockOpen sx={{ mr: 1 }} />
                Change Password
              </MenuItem>
              <MenuItem onClick={openLogoutDialog}>
                <ExitToApp sx={{ mr: 1 }} />
                Logout
              </MenuItem>
              <MenuItem onClick={openDeleteDialog} sx={{ color: "red" }}>
                <Delete sx={{ mr: 1 }} />
                Delete Account
              </MenuItem>
            </Menu>
            {/* Help Icon with Dropdown */}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete your account? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} variant="outlined" sx={{ color: "gray", borderColor: "gray", ":hover": { backgroundColor: "#f5f5f5", borderColor: "gray" } }}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteAccount} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={closeLogoutDialog}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to logout?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} variant="outlined" sx={{ color: "gray", borderColor: "gray", ":hover": { backgroundColor: "#f5f5f5", borderColor: "gray" } }}>
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="primary" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminNavbar;
