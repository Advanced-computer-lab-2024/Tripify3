import React, { useState, useEffect } from "react";
import { getUserId, clearUser } from "../../utils/authUtils.js";
import axios from "axios";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import {
  AppBar,
  List,
  ListItem,
  ListItemText,
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
  Alert,
} from "@mui/material";
import {
  AccountCircle,
  ShoppingCart,
  Favorite,
  Home,
  Event,
  DirectionsRun,
  ListAlt,
  Badge,
  Notifications,
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
import { useMatch } from "react-router-dom";

import { useNavigate, useLocation } from "react-router-dom";

const TouristNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = getUserId();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/get/notifications/${userId}`);
      setNotifications(response.data);

      setUnreadCount(response.data.filter((n) => !n.readStatus).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Use effect to fetch notifications every 30 seconds
  useEffect(() => {
    fetchNotifications(); // Fetch immediately on mount
    const interval = setInterval(fetchNotifications, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Open notification menu
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  // Close notification menu
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

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

  const isChatbotRoute = location.pathname === "/chatbot";
  const isSelectAddressRoute = useMatch("/tourist/select/address/:price/:type/:dropOffDate");
  const isPaymentRoute = useMatch("/tourist/payment/:price/:type/:itemId/:tickets/:dropOffLocation/:dropOffDate");

  return (
    <>
      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#003366", zIndex: 1300 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
            Tripify
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton color="inherit" sx={{ color: "#fff" }} onClick={handleHomeClick}>
              <Home />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Home
              </Typography>
            </IconButton>
           
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
              <MenuItem onClick={handleOrdersClick}>
                <Assignment sx={{ mr: 1 }} /> Orders
              </MenuItem>
              <MenuItem onClick={handlePaymentsClick}>
                <MonetizationOn sx={{ mr: 1 }} /> Payments
              </MenuItem>
              <MenuItem onClick={handleComplaintsClick}>
                <ReportProblemIcon sx={{ mr: 1 }} /> My Complaints
              </MenuItem>
              <MenuItem onClick={handleBookingsClick}>
                <ListAlt sx={{ mr: 1 }} /> Bookings
              </MenuItem>
              <MenuItem onClick={handleWishlistClick}>
                <Favorite sx={{ mr: 1 }} /> Wishlist
              </MenuItem>
              <MenuItem onClick={handleGiftCardsClick}>
                <CardGiftcard sx={{ mr: 1 }} /> Gift Cards
              </MenuItem>
            </Menu>
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleCartClick}>
              <ShoppingCart />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Cart
              </Typography>
            </IconButton>
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
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleHelpClick}>
              <HelpOutline />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Help
              </Typography>
            </IconButton>
            <Menu anchorEl={helpAnchorEl} open={Boolean(helpAnchorEl)} onClose={handleHelpClose}>
              <MenuItem onClick={() => navigate("/tourist/file-complaint")}>
                <Report sx={{ mr: 1 }} />
                File a Complaint
              </MenuItem>
            </Menu>
             {/* Notifications Icon */}
             <IconButton color="inherit" sx={{ color: "#fff", ml:2 }} onClick={handleNotificationClick}>
              <NotificationsNoneIcon />
            </IconButton>
            {/* Notifications Menu */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              PaperProps={{
                style: {
                  maxHeight: 300, // Limit menu height
                  width: 350,
                  transition: "transform 0.2s ease-in-out", // Add smooth animation
                },
              }}
            >
              <Typography variant="h6" sx={{ padding: "8px 16px", fontWeight: "bold", color: "#003366" }}>
                Notifications
              </Typography>
              <List>
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <ListItem key={index} divider>
                      <ListItemText primary={notification.message} secondary={new Date(notification.createdAt).toLocaleString()} />
                    </ListItem>
                  ))
                ) : (
                  <MenuItem>No notifications</MenuItem>
                )}
              </List>
            </Menu>
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
          <Button
            onClick={closeDeleteDialog}
            variant="outlined"
            sx={{
              color: "gray",
              borderColor: "gray",
              ":hover": { backgroundColor: "#f5f5f5", borderColor: "gray" },
            }}
          >
            Cancel
          </Button>
          <Button onClick={confirmDeleteAccount} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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

      {!isChatbotRoute && !isSelectAddressRoute && !isPaymentRoute && (
        <AppBar position="fixed" sx={{ top: "56px", backgroundColor: "#00695C", zIndex: 1299 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton color="inherit" sx={{ color: "#fff" }} onClick={() => navigate("/search_hotels")}>
              <Hotel />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Hotels
              </Typography>
            </IconButton>
            <IconButton color="inherit" sx={{ color: "#fff" }} onClick={() => navigate("/transportation")}>
              <DirectionsCar sx={{ display: "inline" }} />{" "}
              <Typography variant="body1" sx={{ ml: 1 }}>
                To Go
              </Typography>
            </IconButton>
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/tourist/itineraries")}>
              <ListAlt />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Itineraries
              </Typography>
            </IconButton>
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/tourist/historical-places")}>
              <AccountBalanceIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Historical Places
              </Typography>
            </IconButton>
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={() => navigate("/tourist/products")}>
              <AccountBalanceIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Products
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

            <Box sx={{ display: "flex", alignItems: "center", marginLeft: "0px" }}>
              <CartIcon /> {/* Cart icon in desired color */}
              <Typography variant="body1" sx={{ fontWeight: 500, ml: "-8px" }}>
                Cart
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
};

export default TouristNavbar;
