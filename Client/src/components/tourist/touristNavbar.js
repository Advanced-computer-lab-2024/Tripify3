import React, { useState, useEffect, useRef } from "react";
import { getUserId, clearUser } from "../../utils/authUtils.js";
import axios from "axios";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import cleopatraImage from "../../assets/cleopatra.png";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import Badge from "@mui/material/Badge";
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
  Notifications,
  RoomService,
  HelpOutline,
  Settings,
  LocalDining,
  MonetizationOn,
  CardGiftcard,
  DirectionsCar,
} from "@mui/icons-material";
import ArrowDownwardIcon from "@mui/icons-material/KeyboardArrowDown";
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
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  // Define all steps for the tutorial
  // Define tutorial steps
  const steps = [
    { id: "home", description: "This is your Home button. Click to explore the homepage." },
    { id: "account", description: "This is your Account section. Click to manage your profile." },
    { id: "cleopatra", description: "Meet Cleopatra, your virtual Tour Guide."},
    { id: "settings", description: "Manage your account settings here." },
    { id: "notifications", description: "Check your Notifications here." },
    { id: "help", description: "Need help? Click here for support." },
    { id: "hotels", description: "Search for Hotels. Click here to book your stay." },
    { id: "toGo", description: "Explore transportation options. Click here to find rides." },
    { id: "itineraries", description: "View your itineraries. Click here for planned activities." },
    { id: "historicalPlaces", description: "Discover historical places. Click here to explore." },
    { id: "products", description: "Shop for Products. Click here to view." },
    { id: "activities", description: "Looking for activities? Click here to explore." },
    { id: "flights", description: "Looking for flights? Click here to book one." },
    { id: "cart", description: "This is your Cart. Click to view your items." },
  ];

  const currentInstruction = steps[currentStep];

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

  const refs = useRef(
    steps.reduce((acc, step) => {
      acc[step.id] = React.createRef();
      return acc;
    }, {})
  );

  const [currentPosition, setCurrentPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (currentStep < steps.length) {
      const stepId = steps[currentStep].id;
      const ref = refs.current[stepId]?.current;
      if (ref) {
        const rect = ref.getBoundingClientRect();
        setCurrentPosition({
          top: rect.top + window.scrollY - 50, // Adjust for arrow placement
          left: rect.left + window.scrollX + rect.width / 2, // Center the arrow
        });
      }
    }
  }, [currentStep]);

  const handleNextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const username = sessionStorage.getItem("username");
      if (username) {
        try {
          // Send POST request to the logout endpoint with the username
          await axios.post("http://localhost:8000/access/user/logout", { username });
          sessionStorage.setItem("firstTimeLogin", false);
        } catch (error) {
          console.error("Error during logout:", error.response ? error.response.data : error.message);
        }
      }
      setShowInstructions(false);
    }
  };
  // Use effect to fetch notifications every 30 seconds
  useEffect(() => {
    const isFirstTime = sessionStorage.getItem("firstTimeLogin");
    if (isFirstTime === "true") {
      setShowInstructions(true);
    }
    fetchNotifications(); // Fetch immediately on mount
    const interval = setInterval(fetchNotifications, 20000); // Fetch every 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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

  const confirmLogout = async () => {
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
  const handleGiftCardsClick = () => navigate("/tourist/bookmark/events");
  const handleComplaintsClick = () => navigate("/tourist/view/complaints/");

  const isChatbotRoute = location.pathname === "/chatbot";
  const isSelectAddressRoute = useMatch("/tourist/select/address/:price/:type/:dropOffDate");
  const isPaymentRoute = useMatch("/tourist/payment/:price/:type/:itemId/:tickets/:dropOffLocation/:dropOffDate");

  return (
    <>
      {/* Top Navbar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#003366", zIndex: 1300 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Tripify Logo and Text */}
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
            <IconButton
              ref={refs.current.home}
              id="home"
              color="inherit"
              sx={{ color: "#fff" }}
              onClick={() => {
                navigate("/tourist/homepage");
                if (showInstructions && steps[currentStep].id === "home") handleNextStep();
              }}
            >
              <Home />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Home
              </Typography>
            </IconButton>
            <IconButton
              id="account"
              ref={refs.current.account}
              color="inherit"
              sx={{ color: "#fff", ml: 2 }}
              onClick={(event) => {
                handleAccountClick(event);
                if (showInstructions && steps[currentStep].id === "account") handleNextStep();
              }}
            >
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
              {/* <MenuItem onClick={handlePaymentsClick}>
                <MonetizationOn sx={{ mr: 1 }} /> Payments
              </MenuItem> */}
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
                <BookmarkIcon sx={{ mr: 1 }} /> Bookmarked Events
              </MenuItem>
            </Menu>

            <IconButton
              ref={refs.current.cleopatra}
              id="cleopatra"
              color="inherit"
              sx={{ color: "#fff", display: "flex", alignItems: "center", ml: 2}}
              onClick={() => {
                if (!showInstructions) {
                  navigate("/chatbot");
                }
                if (showInstructions && steps[currentStep].id === "cleopatra") handleNextStep();
              }}
            >
              <Box
                component="img"
                src={cleopatraImage}
                alt="Cleopatra"
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%", // Make it circular
                  objectFit: "cover", // Ensure the image fits well
                  mr: 1, // Margin right for spacing
                }}
              />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Cleopatra
              </Typography>
            </IconButton>

            <IconButton
              id="settings"
              ref={refs.current.settings}
              color="inherit"
              sx={{ color: "#fff", ml: 2 }}
              onClick={(event) => {
                handleSettingsClick(event);
                if (showInstructions && steps[currentStep].id === "settings") handleNextStep();
              }}
            >
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
            <Menu anchorEl={helpAnchorEl} open={Boolean(helpAnchorEl)} onClose={handleHelpClose}>
              <MenuItem onClick={() => navigate("/tourist/file-complaint")}>
                <Report sx={{ mr: 1 }} />
                File a Complaint
              </MenuItem>
              <MenuItem
                onClick={() => {
                  sessionStorage.setItem("firstTimeLogin", true); // Set firstTimeLogin to true
                  window.location.reload(); // Re-render components by refreshing the page
                }}
              >
                <HelpOutlineIcon sx={{ mr: 1 }} /> Review Tutorial
              </MenuItem>
            </Menu>
            {/* Notifications Icon */}

            {/* <Badge
              badgeContent={unreadCount}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "orange", // Set the background color to yellow
                  color: "white", // Adjust text color for contrast
                  top: 8, // Adjust vertical position
                  right: 28, // Adjust horizontal position
                },
              }}
            >
              <IconButton
                id="notifications"
                ref={refs.current.notifications}
                color="inherit"
                sx={{ color: "#fff", ml: 2 }}
                onClick={(event) => {
                  handleNotificationClick(event);
                  if (showInstructions && steps[currentStep].id === "notifications") handleNextStep();
                }}
              >
                <NotificationsNoneIcon />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  Notifications
                </Typography>
              </IconButton>
            </Badge> */}
            <IconButton
              id="notifications"
              ref={refs.current.notifications}
              color="inherit"
              sx={{ color: "#fff", ml: 2 }}
              onClick={(event) => {
                handleNotificationClick(event);
                if (showInstructions && steps[currentStep].id === "notifications") handleNextStep();
              }}
            >
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
            <IconButton
              id="help"
              ref={refs.current.help}
              color="inherit"
              sx={{ color: "#fff", ml: 2 }}
              onClick={(event) => {
                handleHelpClick(event);
                if (showInstructions && steps[currentStep].id === "help") handleNextStep();
              }}
            >
              <HelpOutline />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Help
              </Typography>
            </IconButton>
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
        <AppBar position="fixed" sx={{ minHeight: "30px", top: "56px", backgroundColor: "#007958", zIndex: 1299 }}>
          <Toolbar
            sx={{
              minHeight: "30px",
              padding: "0 16px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IconButton
              id="hotels"
              ref={refs.current.hotels}
              color="inherit"
              sx={{ color: "#fff" }}
              onClick={() => {
                navigate("/search_hotels");
                if (showInstructions && steps[currentStep].id === "hotels") handleNextStep();
              }}
            >
              <Hotel />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Hotels
              </Typography>
            </IconButton>
            <IconButton
              id="toGo"
              ref={refs.current.toGo}
              color="inherit"
              sx={{ color: "#fff" }}
              onClick={() => {
                navigate("/transportation");
                if (showInstructions && steps[currentStep].id === "toGo") handleNextStep();
              }}
            >
              <DirectionsCar sx={{ display: "inline" }} />{" "}
              <Typography variant="body1" sx={{ ml: 1 }}>
                To Go
              </Typography>
            </IconButton>
            <IconButton
              id="itineraries"
              ref={refs.current.itineraries}
              color="inherit"
              sx={{ color: "#fff", ml: 2 }}
              onClick={() => {
                navigate("/tourist/itineraries");
                if (showInstructions && steps[currentStep].id === "itineraries") handleNextStep();
              }}
            >
              <ListAlt />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Itineraries
              </Typography>
            </IconButton>
            <IconButton
              id="historicalPlaces"
              ref={refs.current.historicalPlaces}
              color="inherit"
              sx={{ color: "#fff", ml: 2 }}
              onClick={() => {
                navigate("/tourist/historical-places");
                if (showInstructions && steps[currentStep].id === "historicalPlaces") handleNextStep();
              }}
            >
              <AccountBalanceIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Historical Places
              </Typography>
            </IconButton>
            <IconButton
              id="products"
              ref={refs.current.products}
              color="inherit"
              sx={{ color: "#fff", ml: 2 }}
              onClick={() => {
                navigate("/tourist/products");
                if (showInstructions && steps[currentStep].id === "products") handleNextStep();
              }}
            >
              <CategoryIcon />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Products
              </Typography>
            </IconButton>
            <IconButton
              id="activities"
              ref={refs.current.activities}
              color="inherit"
              sx={{ color: "#fff", ml: 2 }}
              onClick={() => {
                navigate("/tourist/activities");
                if (showInstructions && steps[currentStep].id === "activities") handleNextStep();
              }}
            >
              <DirectionsRun />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Activities
              </Typography>
            </IconButton>
            <IconButton
              id="flights"
              ref={refs.current.flights}
              color="inherit"
              sx={{ color: "#fff", ml: 2 }}
              onClick={() => {
                navigate("/search_flights");
                if (showInstructions && steps[currentStep].id === "flights") handleNextStep();
              }}
            >
              <Flight />
              <Typography variant="body1" sx={{ ml: 1 }}>
                Flights
              </Typography>
            </IconButton>
            <Box
              onClick={() => {
                if (showInstructions && steps[currentStep].id === "cart") handleNextStep();
              }}
              sx={{ display: "flex", alignItems: "center", marginLeft: "0px" }}
            >
              <CartIcon />
              <Typography id="cart" ref={refs.current.cart} variant="body1" sx={{ fontWeight: 500, ml: "-8px" }}>
                Cart
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}
      {showInstructions && currentInstruction && (
        <Box
          sx={{
            position: "absolute",
            top: currentPosition.top + 90, // Adjusted position dynamically
            left: currentPosition.left - 20, // Adjusted to align with the element
            zIndex: 1400,
            textAlign: "center",
          }}
        >
          {/* Arrow pointing out of the top left corner */}
          <Box
            sx={{
              position: "absolute",
              top: -10, // Position the arrow above the label
              left: 10, // Offset slightly from the left
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: "10px solid orange", // Arrow color matches the background
            }}
          />
          <Typography
            sx={{
              backgroundColor: "orange", // Orange background
              color: "#fff",
              padding: "8px",
              borderRadius: "4px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {currentInstruction.description}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default TouristNavbar;
