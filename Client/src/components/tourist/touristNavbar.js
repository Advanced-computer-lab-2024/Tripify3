import React from "react";
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
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"; // Import icon

  Settings,
  LocalDining, // Added icon for Orders
  MonetizationOn, // Added icon for Payments
  CardGiftcard, // Added icon for Gift Cards
} from "@mui/icons-material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import Report from "@mui/icons-material/Report"; // Add this import for the complaint icon
import Hotel from "@mui/icons-material/Hotel"; // For Hotels
import Flight from "@mui/icons-material/Flight"; // For Flights
import Assignment from "@mui/icons-material/Assignment"; // Add this import for the new icon
import LockOpen from "@mui/icons-material/LockOpen"; // For Forget Password
import Delete from "@mui/icons-material/Delete"; // For Delete Account
import ExitToApp from "@mui/icons-material/ExitToApp"; // For Logout


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
    navigate("/tourist/profile");
  };
  
  const handleHomeClick = () => {
    navigate("/tourist/homepage");
  };
  
  const handleCartClick = () => {
    navigate("/tourist/cart");
  };
  


  const [anchorEl, setAnchorEl] = useState(null);
  const [helpAnchorEl, setHelpAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null); // New state for Account dropdown
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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
  const handleOrdersClick = () => navigate("/tourist/orders");
  const handlePaymentsClick = () => navigate("/tourist/payments");
  const handleBookingsClick = () => navigate("/tourist/bookings");
  const handleWishlistClick = () => navigate("/tourist/wishlist");
  const handleGiftCardsClick = () => navigate("/tourist/gift-cards");

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

              <Typography variant="body1" sx={{ ml: 1 }}>Home</Typography>
            </IconButton>

            {/* Account Icon with Dropdown */}
            <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleAccountClick}>
              <AccountCircle />
              <Typography variant="body1" sx={{ ml: 1 }}>Account</Typography>
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
    <IconButton color="inherit" sx={{ color: "#fff", ml: 2 }} onClick={handleHelpClick}>
              <HelpOutline />
              <Typography variant="body1" sx={{ ml: 1 }}>Help</Typography>
            </IconButton>
            <Menu anchorEl={helpAnchorEl} open={Boolean(helpAnchorEl)} onClose={handleHelpClose}>
  <MenuItem onClick={() => navigate("/tourist/file-complaint")}>
    <Report sx={{ mr: 1 }} /> {/* Add this line for the complaint icon */}
    File a Complaint
  </MenuItem>
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
          <Button onClick={closeDeleteDialog} variant="outlined" sx={{ color: "gray", borderColor: "gray", ":hover": { backgroundColor: "#f5f5f5", borderColor: "gray" } }}>Cancel</Button>
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
          <Button onClick={closeLogoutDialog} variant="outlined" sx={{ color: "gray", borderColor: "gray", ":hover": { backgroundColor: "#f5f5f5", borderColor: "gray" } }}>Cancel</Button>
          <Button onClick={confirmLogout} color="primary" variant="contained">Logout</Button>
        </DialogActions>
      </Dialog>
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
  )
};

export default TouristNavbar;