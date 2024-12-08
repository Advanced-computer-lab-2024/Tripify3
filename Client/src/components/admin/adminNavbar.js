import React, { useState, useEffect } from "react";
import axios from "axios";
import Badge from "@mui/material/Badge";
import { AppBar,  List,
  ListItem,
  ListItemText, Toolbar, Typography, Box, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
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
import { clearUser, getUserId } from "../../utils/authUtils";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = getUserId();

  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null); // New state for Account dropdown
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleSettingsClick = (event) => setSettingsAnchorEl(event.currentTarget);
  const handleSettingsClose = () => setSettingsAnchorEl(null);
  const handleAccountClick = (event) => setAccountAnchorEl(event.currentTarget); // New handler for Account dropdown
  const handleAccountClose = () => setAccountAnchorEl(null); // Close Account dropdown

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


  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
    setSettingsAnchorEl(null);
  };
  const closeLogoutDialog = () => setLogoutDialogOpen(false);

  const confirmLogout = () => {
    // Add logout logic here
    setLogoutDialogOpen(false);
    clearUser();
    navigate("/login"); // Redirect to login page after logout
  };

     // Open notification menu and mark all notifications as read
const handleNotificationClick = async (event) => {
  setNotificationAnchorEl(event.currentTarget); // Open the notification menu

  try {
    // Call the API to mark all notifications as read
    const response = await axios.put(`http://localhost:8000/notifications/read/${userId}`);
    
    if (response.data.success) {
      // Update the unread count to 0 since all are marked as read
      setUnreadCount(0);
    }
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};

    // Close notification menu
    const handleNotificationClose = () => {
      setNotificationAnchorEl(null);
    };
  
  const handleProfileClick = () => navigate("/admin/profile");
  const hiddenRoutes = ["/tourist/profile", "/tourist/wishlist"];
  const hideProfileAndWishlist = hiddenRoutes.includes(location.pathname);

  return (
    <>
      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#003366", zIndex: 1300 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Home Icon */}

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
              <MenuItem onClick={() => navigate("/admin/change-password")}>
                <LockOpen sx={{ mr: 1 }} />
                Change Password
              </MenuItem>
              <MenuItem onClick={openLogoutDialog}>
                <ExitToApp sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
             
            <IconButton id="notifications"  color="inherit" sx={{ color: "#fff", ml: 2 }}      onClick={(event) => {
                handleNotificationClick(event);
              }}>
              <Badge
                badgeContent={unreadCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "orange", // Set the background color to orange
                    color: "white", // Adjust text color for contrast
                    top: -2, // Adjust vertical position for proper alignment
                    right: 0, // Adjust horizontal position for proper alignment
                  },
                }}
              >
                <NotificationsNoneIcon />
              </Badge>
              <Typography variant="body1" sx={{ ml: 1 }}>
                Notifications
              </Typography>
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
            {/* Help Icon with Dropdown */}
          </Box>
        </Toolbar>
      </AppBar>

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
