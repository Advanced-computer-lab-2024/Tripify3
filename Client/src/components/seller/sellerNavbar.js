import React, { useState } from "react";
import axios from "axios";
import { getUserId, clearUser } from "../../utils/authUtils.js";

import { AppBar,Alert, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
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

import Assignment from "@mui/icons-material/Assignment"; // Add this import for the new icon
import LockOpen from "@mui/icons-material/LockOpen"; // For Forget Password
import Delete from "@mui/icons-material/Delete"; // For Delete Account
import ExitToApp from "@mui/icons-material/ExitToApp"; // For Logout

import { useNavigate, useLocation } from "react-router-dom";

const SellerNavbar = () => {
  const userId = getUserId();

  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null); // New state for Account dropdown
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [bookingErrorDialogOpen, setBookingErrorDialogOpen] = useState(false);

  const handleServicesClick = (event) => setAnchorEl(event.currentTarget);
  const handleServicesClose = () => setAnchorEl(null);
  const handleHelpClick = (event) => setHelpAnchorEl(event.currentTarget);
  const handleHelpClose = () => setHelpAnchorEl(null);
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
      const response = await fetch(`http://localhost:8000/seller/delete/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteDialogOpen(false);
        navigate('/goodbye');
      } else if (response.status === 403) {
        setDeleteDialogOpen(false);
        setBookingErrorDialogOpen(true);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete account: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const confirmLogout = () => {
    // Add logout logic here
    setLogoutDialogOpen(false);
    clearUser();
    navigate("/"); // Redirect to login page after logout
  };

  const handleProfileClick = () => navigate("/seller/profile");

  return (
    <>
      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#003366", zIndex: 1300 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
            Tripify
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
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
            {/* Settings Icon with Dropdown */}
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleSettingsClick}>
              <Settings />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Settings
              </Typography>
            </IconButton>
            <Menu anchorEl={settingsAnchorEl} open={Boolean(settingsAnchorEl)} onClose={handleSettingsClose}>
              <MenuItem onClick={() => navigate("/seller/change-password")}>
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
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} variant="outlined" sx={{ color: "gray", borderColor: "gray", ":hover": { backgroundColor: "#f5f5f5", borderColor: "gray" } }}>Cancel</Button>
          <Button onClick={confirmDeleteAccount} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Booking Error Dialog */}
      <Dialog open={bookingErrorDialogOpen} onClose={() => setBookingErrorDialogOpen(false)}>
        <DialogTitle sx={{ color: "#f44336" }}>Unable to Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            You have upcoming bookings. Please cancel them before deleting your account.
          </Alert>
          <DialogContentText>
            If you need further assistance, please contact our support team.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingErrorDialogOpen(false)} variant="outlined" sx={{ color: "#f44336", borderColor: "#f44336", ":hover": { backgroundColor: "#fdecea", borderColor: "#f44336" } }}>Close</Button>
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

export default SellerNavbar;
