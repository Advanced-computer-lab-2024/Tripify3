import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Add, Delete, CheckCircle, Cancel, Visibility, VisibilityOff } from "@mui/icons-material";
import { getUploadedFiles, getAllAcceptedUsers, getAllPendingUsers, updateUserStatus, removeUser, addUser } from "../../services/admin.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e3a5f", // Dark blue
    },
    secondary: {
      main: "#ff6f00", // Orange
    },
  },
});

const Users = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUserType, setNewUserType] = useState("Admin"); // Default to Admin
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [addUserError, setAddUserError] = useState(""); // Error message for adding user
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [openFileViewer, setOpenFileViewer] = useState(false);
  const [fileUrls, setFileUrls] = useState([]);
  const [openPromoCodeDialog, setOpenPromoCodeDialog] = useState(false);
  const [promoTouristId, setPromoTouristId] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [promoError, setPromoError] = useState("");

  const navigate = useNavigate(); // Use useNavigate for navigation

  // Fetch both accepted and pending users when the component mounts
  // Function to fetch users
  const fetchUsers = async () => {
    setLoading(true); // Set loading state
    try {
      const pendingResponse = await getAllPendingUsers();
      setPendingUsers(pendingResponse.data);

      const acceptedResponse = await getAllAcceptedUsers();
      setAcceptedUsers(acceptedResponse.data);

      setLoading(false); // Reset loading state
    } catch (error) {
      setError("Error fetching users");
      setLoading(false); // Reset loading state
    }
  };

  // Fetch both accepted and pending users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleGivePromoCode = (touristId) => {
    setPromoTouristId(touristId);
    setOpenPromoCodeDialog(true);
  };

  const handleAddPromoCode = async () => {
    if (!expiryDate || new Date(expiryDate) < new Date()) {
      setPromoError("Expiry date must be today or later.");
      return;
    }
    if (!discount || discount <= 0 || discount > 100) {
      setPromoError("Discount percentage must be between 1 and 100.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/admin/promocode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          touristId: promoTouristId,
          discount,
          expiryDate,
        }),
      });

      if (!response.ok) {
        throw new Error("Error giving promo code");
      }

      // Close the dialog and reset form
      setOpenPromoCodeDialog(false);
      setPromoTouristId("");
      setDiscount("");
      setExpiryDate("");
      setPromoError("");
      alert("Promo code added successfully!");
    } catch (error) {
      console.error("Error adding promo code:", error);
      setPromoError("Failed to add promo code. Try again.");
    }
  };

  const handleUpdateUserStatus = async (id, status) => {
    try {
      await updateUserStatus(id, status);
      // Re-fetch users to get the updated lists
      await fetchUsers(); // Call the fetch function
    } catch (error) {
      alert("Error updating user status");
    }
  };

  const handleRemoveUser = async (id) => {
    try {
      await removeUser(id);
      setAcceptedUsers(acceptedUsers.filter((user) => user._id !== id));
    } catch (error) {
      alert("Error removing user");
    }
  };

  const handleViewDocuments = async (userId) => {
    try {
      const response = await getUploadedFiles(userId);
      const files = response.data;
      if (files && files.length > 0) {
        // Navigate to the FileViewer page with userId and files
        navigate(`/admin/file-viewer`, { state: { files, userId } });
      } else {
        alert("No documents available for this user.");
      }
    } catch (error) {
      console.error("Error fetching files", error);
      alert("Error fetching documents.");
    }
  };

  const handleAddUser = async () => {
    setAddUserError(""); // Reset error message
    if (!newUsername || !newPassword || !newEmail) {
      alert("Username, email, and password are required");
      return;
    }

    try {
      const response = await addUser({ username: newUsername, password: newPassword, type: newUserType, email: newEmail });
      setAcceptedUsers([...acceptedUsers, response.data]);
      setNewUsername("");
      setNewPassword("");
      setNewEmail("");
      setOpenAddUserDialog(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setAddUserError("Username already exists");
      } else {
        alert("Error adding user");
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 4 }}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
              User Management
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Add User Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAddUserDialog(true)} color="primary">
            Add User
          </Button>
        </Box>

        {/* Pending Requests Section */}
        <Typography variant="h5" sx={{ mt: 4 }}>
          Pending Requests
        </Typography>
        <Grid container spacing={3}>
          {pendingUsers.map((user) => (
            <Grid item xs={12} md={6} key={user._id}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  backgroundColor: "#f5f5f5",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1e3a5f" }}>{user.username}</Typography>
                  <Typography color="textSecondary">{user.type}</Typography>
                  <Typography color="textSecondary">{user.email}</Typography>
                </CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Button variant="contained" color="primary" onClick={() => handleViewDocuments(user._id)}>
                    View Documents
                  </Button>
                  <IconButton onClick={() => handleUpdateUserStatus(user._id, "Accepted")} color="success" sx={{ ml: 2 }}>
                    <CheckCircle />
                  </IconButton>
                  <IconButton onClick={() => handleUpdateUserStatus(user._id, "Rejected")} color="error">
                    <Cancel />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* All Accepted Users Section */}
        <Typography variant="h5" sx={{ mt: 4 }}>
          All Accepted Users
        </Typography>
        <Grid container spacing={3}>
          {acceptedUsers.map((user) => (
            <Grid item xs={12} md={6} key={user._id}>
              <Card sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                <CardContent>
                  <Typography variant="h6">{user.username}</Typography>
                  <Typography color="textSecondary">{user.type}</Typography>
                  <Typography color="textSecondary">{user.email}</Typography>
                </CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => handleRemoveUser(user._id)} color="error" sx={{ mr: 1 }}>
                    <Delete />
                  </IconButton>
                  {user.type === "Tourist" && (
                    <Button variant="contained" color="secondary" onClick={() => handleGivePromoCode(user._id)}>
                      Give Promo Code
                    </Button>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Add User Dialog */}
        <Dialog open={openAddUserDialog} onClose={() => setOpenAddUserDialog(false)}>
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
            {addUserError && (
              <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                {addUserError}
              </Typography>
            )}
            <TextField label="Username" variant="outlined" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Email" variant="outlined" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <Visibility /> : <VisibilityOff />}</IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Select label="User Type" value={newUserType} onChange={(e) => setNewUserType(e.target.value)} fullWidth variant="outlined" sx={{ mb: 2 }}>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Tourism Governor">Tourism Governor</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddUser} color="primary" variant="contained">
              Add
            </Button>
            <Button onClick={() => setOpenAddUserDialog(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openPromoCodeDialog} onClose={() => setOpenPromoCodeDialog(false)}>
          <DialogTitle>Give Promo Code</DialogTitle>
          <DialogContent>
            {promoError && (
              <Typography color="error" variant="body2" sx={{ mb: 1 }}>
                {promoError}
              </Typography>
            )}
            <TextField
              label="Discount Percentage"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
            <TextField
              label="Expiry Date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddPromoCode} color="primary" variant="contained">
              Add Promo Code
            </Button>
            <Button onClick={() => setOpenPromoCodeDialog(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default Users;
