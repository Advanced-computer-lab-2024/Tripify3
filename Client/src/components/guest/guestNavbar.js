import React, { useState } from "react";
import { getUserId, clearUser } from "../../utils/authUtils.js";

import { AppBar, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Alert } from "@mui/material";
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
  LocalDining,
  MonetizationOn,
  CardGiftcard,
  DirectionsCar,
} from "@mui/icons-material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import Report from "@mui/icons-material/Report";
import Hotel from "@mui/icons-material/Hotel";
import Flight from "@mui/icons-material/Flight";
import Assignment from "@mui/icons-material/Assignment";
import LockOpen from "@mui/icons-material/LockOpen";
import Delete from "@mui/icons-material/Delete";
import ExitToApp from "@mui/icons-material/ExitToApp";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CartIcon from "../../pages/seller/new/assets/cartIcon.js";

import { useNavigate, useLocation } from "react-router-dom";

const GuestNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = getUserId();

  const [anchorEl, setAnchorEl] = useState(null);
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [bookingErrorDialogOpen, setBookingErrorDialogOpen] = useState(false);

  const handleHelpClick = (event) => setHelpAnchorEl(event.currentTarget);
  const handleHelpClose = () => setHelpAnchorEl(null);
  const handleSettingsClick = (event) => setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);
  const handleAccountClick = (event) => setAccountAnchorEl(event.currentTarget);
  const handleAccountClose = () => setAccountAnchorEl(null);

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
      const response = await fetch(`http://localhost:8000/tourist/delete/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteDialogOpen(false);
        navigate("/goodbye");
      } else if (response.status === 403) {
        setDeleteDialogOpen(false);
        setBookingErrorDialogOpen(true);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete account: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  const confirmLogout = () => {
    setLogoutDialogOpen(false);
    clearUser();
    navigate("/login");
  };

  const handleProfileClick = () => navigate("/tourist/profile");
  const handleHomeClick = () => navigate("/tourist/homepage");
  const handleCartClick = () => navigate("/tourist/cart");
  const handleOrdersClick = () => navigate("/tourist/my-orders");
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
          {/* Application Name */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={require("../../assets/logo.jpeg")}
              alt="Tripify Logo"
              style={{ height: "40px", marginRight: "8px" }} // Adjust spacing
            />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
              Tripify
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button variant="outlined" color="inherit" sx={{ color: "#fff", borderColor: "#fff", mr: 2 }} href="/signup">
              Sign Up
            </Button>
            <Button variant="contained" color="secondary" href="/login">
              Log In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Booking Error Dialog */}
      <Dialog open={bookingErrorDialogOpen} onClose={() => setBookingErrorDialogOpen(false)}>
        <DialogTitle sx={{ color: "#f44336" }}>Unable to Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            You have upcoming bookings. Please cancel them before deleting your account.
          </Alert>
          <DialogContentText>If you need further assistance, please contact our support team.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBookingErrorDialogOpen(false)}
            variant="outlined"
            sx={{
              color: "#f44336",
              borderColor: "#f44336",
              ":hover": { backgroundColor: "#fdecea", borderColor: "#f44336" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Logout Dialog */}
      <Dialog open={logoutDialogOpen} onClose={closeLogoutDialog}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to log out?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeLogoutDialog}
            variant="outlined"
            sx={{
              color: "gray",
              borderColor: "gray",
              ":hover": { backgroundColor: "#f5f5f5", borderColor: "gray" },
            }}
          >
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      <AppBar position="fixed" sx={{ top: "56px", backgroundColor: "#00695C", zIndex: 1299 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/guest/itineraries")}>
            <ListAlt />
            <Typography variant="body1" sx={{ ml: 1 }}>
              Itineraries
            </Typography>
          </IconButton>
          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/guest/historical-places")}>
            <AccountBalanceIcon />
            <Typography variant="body1" sx={{ ml: 1 }}>
              Historical Places
            </Typography>
          </IconButton>

          <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/guest/activities")}>
            <DirectionsRun />
            <Typography variant="body1" sx={{ ml: 1 }}>
              Activities
            </Typography>
          </IconButton>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default GuestNavbar;
