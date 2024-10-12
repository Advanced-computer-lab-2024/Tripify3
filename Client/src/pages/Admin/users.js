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
import { getAllAcceptedUsers, getAllPendingUsers, updateUserStatus, removeUser, addUser } from "../../services/admin.js";

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
  const [newPassword, setNewPassword] = useState("");
  const [newUserType, setNewUserType] = useState("Admin"); // Default to Admin
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [addUserError, setAddUserError] = useState(""); // Error message for adding user
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

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

  const handleAddUser = async () => {
    setAddUserError(""); // Reset error message
    if (!newUsername || !newPassword) {
      alert("Username and password are required");
      return;
    }

    try {
      const response = await addUser({ username: newUsername, password: newPassword, type: newUserType });
      setAcceptedUsers([...acceptedUsers, response.data]);
      setNewUsername("");
      setNewPassword("");
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
              <Card sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                <CardContent>
                  <Typography variant="h6">{user.username}</Typography>
                  <Typography color="textSecondary">{user.type}</Typography>
                  <Typography color="textSecondary">{user.email}</Typography>
                </CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton onClick={() => handleUpdateUserStatus(user._id, "Accepted")} color="success" sx={{ mr: 2 }}>
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
                <IconButton onClick={() => handleRemoveUser(user._id)} color="error">
                  <Delete />
                </IconButton>
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
      </Box>
    </ThemeProvider>
  );
};

export default Users;
