import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Checkbox,
  ListItemText,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from "@mui/material";

import { Delete } from "@mui/icons-material";
import { FaTrophy, FaShieldAlt, FaStarHalfAlt, FaCoins, FaCamera } from "react-icons/fa";
import { getAllTags, getProfile, updateProfile, redeemPoints } from "../../services/tourist.js";
import { getUserId, setUserPreferences } from "../../utils/authUtils.js";
import Wallet from "./wallet.js";

const TouristProfile = () => {
  const navigate = useNavigate();
  const userId = getUserId();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [vacationOptions, setVacationOptions] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    nationality: "",
    birthDate: "",
    occupation: "",
    gender: "",
    currency: "", // Ensure this matches your profile field
    preferences: [], // Ensure this matches your profile field
  });

  const countries = [
    "USA",
    "Canada",
    "UK",
    "Germany",
    "France",
    "Australia",
    "Egypt",
    "Italy",
    "Spain",
    "Brazil",
    "Argentina",
    "Mexico",
    "India",
    "China",
    "Japan",
    "South Korea",
    "Saudi Arabia",
    "United Arab Emirates",
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId);
        const fullName = response.data.userProfile.name.split(" ");

        setUserProfile(response.data.userProfile);
        setFormData({
          username: response.data.userProfile.username,
          email: response.data.userProfile.email,
          firstName: fullName[0],
          lastName: fullName[1] || "",
          phoneNumber: response.data.userProfile.phoneNumber,
          nationality: response.data.userProfile.nationality,
          birthDate: response.data.userProfile.birthDate,
          occupation: response.data.userProfile.occupation,
          currency: response.data.userProfile.currency || "", // Ensure this matches the expected API field
          gender: response.data.userProfile.gender || "",
          preferences: response.data.userProfile.preferences || [],
          filepath: response.data.userProfile.profilePicture ? `http://localhost:8000/uploads/${userId}/${response.data.userProfile.profilePicture.filename}` : "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await getAllTags();
        setVacationOptions(response.data.tags.map((tag) => ({ value: tag.name, label: tag.name })));
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    // Fetch addresses
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tourist/get/addresses/${userId}`);
        setAddresses(response.data.addresses);
        setLoadingAddresses(false);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setLoadingAddresses(false);
      }
    };

    fetchProfile();

    fetchAddresses();
    fetchTags();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {};
      reader.readAsDataURL(file);

      const uploadData = new FormData();
      uploadData.append("userId", userId);
      uploadData.append("file", file);

      try {
        const response = await axios.put("http://localhost:8000/user/upload/picture", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const uploadedImageUrl = `http://localhost:8000/uploads/${userId}/${response.data.profilePicture.filename}`;
        setProfilePicUrl(uploadedImageUrl);
      } catch (error) {
        console.error("Error uploading the image:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    try {
      const response = await updateProfile(userId, formData);
      setUserProfile(response.data.userProfile);
      setIsEditing(false);
      setUserPreferences(formData.preferences);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getBadgeInfo = (points) => {
    if (points > 500000) {
      return { level: 3, text: "Congratulations! You are a Loyalty Master! Keep it up!", icon: <FaTrophy size={40} color="#FFD700" /> };
    } else if (points > 100000) {
      return { level: 2, text: "Great job! You are a Loyalty Pro! Keep collecting points!", icon: <FaShieldAlt size={40} color="#C0C0C0" /> };
    } else {
      return { level: 1, text: "Welcome! You are just starting your loyalty journey! Collect points to level up!", icon: <FaStarHalfAlt size={40} color="#D3D3D3" /> };
    }
  };

  const badgeInfo = userProfile ? getBadgeInfo(userProfile.loyaltyPoints) : { level: 1, text: "", icon: null };

  const handleRedeem = async () => {
    try {
      const response = await redeemPoints(userId, { pointsToRedeem: userProfile.loyaltyPoints });
      setUserProfile(response.data.userProfile);
      setRedeemSuccess(true);
    } catch (error) {
      console.error("Error redeeming points:", error);
      alert("Failed to redeem points. Please try again.");
    }
  };

  const handleCloseRedeemSuccess = () => {
    setRedeemSuccess(false);
  };

  const handlePreferencesChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      preferences: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await axios.delete(`http://localhost:8000/tourist/delete/address/${userId}`, {
        data: { addressId }, // Pass addressId in the request body
      });
      setAddresses((prevAddresses) => prevAddresses.filter((address) => address.id !== addressId));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };
  
  return (
    <Box sx={{ padding: 7 }}>
      {userProfile && (
        <Box sx={{ maxWidth: "900px", margin: "auto" }}>
          <Card sx={{ marginBottom: 4, borderRadius: "10px", padding: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              {badgeInfo.icon}
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6" sx={{ mb: 0 }}>
                  Level Badge: Level {badgeInfo.level}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555" }}>
                  {badgeInfo.text}
                </Typography>
              </Box>
            </Box>
            <CardHeader
              title="Loyalty Points"
              titleTypographyProps={{ variant: "h6" }}
              subheader={userProfile.loyaltyPoints <= 10000 ? "You need at least 10,000 points to redeem your points to cash." : null}
              subheaderTypographyProps={{
                variant: "body2",
                color: "text.secondary",
                sx: { marginTop: 0, marginBottom: -3, fontSize: 12 },
              }}
            />
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", backgroundColor: "#E3F2FD", borderRadius: "20px", padding: "10px 20px" }}>
                <FaCoins size={24} color="#1976d2" style={{ marginRight: "10px" }} />
                <Typography variant="body1" sx={{ color: "#1976d2", fontWeight: "bold" }}>
                  {userProfile.loyaltyPoints} Points
                </Typography>
              </Box>
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  borderRadius: "20px",
                  padding: "8px 16px",
                  marginLeft: 2,
                  transition: "background-color 0.3s",
                  "&:hover": {
                    backgroundColor: "#1976D2",
                    color: "#fff",
                  },
                }}
                onClick={handleRedeem}
                disabled={userProfile.loyaltyPoints < 10000}
              >
                Redeem
              </Button>
            </CardContent>
            <Wallet walletAmount={userProfile.walletAmount} />
          </Card>

          <Card sx={{ borderRadius: "10px", padding: 3 }}>
            <CardHeader title="Profile Information" titleTypographyProps={{ variant: "h6", sx: { marginLeft: -2 } }} />
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
              <Box sx={{ position: "relative", marginRight: 2 }}>
                <Avatar
                  alt="Profile Picture"
                  src={
                    profilePicUrl ||
                    formData.filepath ||
                    "https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8="
                  }
                  sx={{ width: 90, height: 90 }}
                />
                <label htmlFor="profile-pic-upload" style={{ position: "absolute", bottom: 5, right: -3, cursor: "pointer" }}>
                  <FaCamera size={18} color="gray" />
                </label>
                <input id="profile-pic-upload" type="file" accept="image/*" onChange={handleProfilePicChange} style={{ display: "none" }} />
              </Box>
              <Typography variant="h5" marginLeft={-1}>
                @{formData.username}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5, marginTop: 4 }}>
              <TextField label="Name" value={`${formData.firstName} ${formData.lastName}`} disabled={!isEditing} fullWidth sx={{ ml: 0 }} />
              <TextField label="Email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} fullWidth sx={{ mx: 2 }} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
              <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} disabled={!isEditing} onChange={handleChange} fullWidth sx={{ mr: 2 }} />
              <FormControl fullWidth sx={{ mx: 2 }}>
                <InputLabel>Nationality</InputLabel>
                <Select name="nationality" value={formData.nationality} disabled={!isEditing} onChange={handleChange}>
                  {countries.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Birth Date"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                disabled={!isEditing}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ ml: 2 }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
              <FormControl fullWidth sx={{ mx: 2 }}>
                <InputLabel>Currency</InputLabel>
                <Select name="currency" value={formData.currency} disabled={!isEditing} onChange={handleChange}>
                  <MenuItem value="EGP">EGP</MenuItem>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="AUD">AUD</MenuItem>
                  <MenuItem value="CAD">CAD</MenuItem>
                </Select>
              </FormControl>

              <TextField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} disabled={!isEditing} fullWidth sx={{ mr: 2 }} />
              <FormControl fullWidth sx={{ mx: 2 }}>
                <InputLabel>Gender</InputLabel>
                <Select name="gender" value={formData.gender} disabled={!isEditing} onChange={handleChange}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mx: 2 }}>
                <InputLabel>Preferences</InputLabel>
                <Select
                  name="preferences"
                  value={formData.preferences}
                  multiple
                  disabled={!isEditing}
                  onChange={handlePreferencesChange}
                  renderValue={(selected) => selected.map((pref) => vacationOptions.find((option) => option.value === pref)?.label).join(", ")}
                >
                  {vacationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Checkbox checked={formData.preferences.includes(option.value)} />
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              onClick={() => {
                if (isEditing) handleSubmit();
                setIsEditing(!isEditing);
              }}
              sx={{ marginBottom: 2 }}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Card>

          {/* Addresses Section */}
          <Card sx={{ borderRadius: "10px", padding: 3, marginTop: 3 }}>
            <Typography variant="h6" gutterBottom>
              My Addresses
            </Typography>
            <Box>
              {loadingAddresses ? (
                <Typography>Loading addresses...</Typography>
              ) : addresses.length === 0 ? (
                <Typography>No addresses found. Add one now!</Typography>
              ) : (
                <Grid container spacing={3}>
                  {addresses.map((address) => (
                    <Grid item xs={12} md={6} key={address.id}>
                      <Card
                        sx={{
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <CardContent>
                          <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1 }}>
                            {address.label}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {address.location}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <IconButton
                            onClick={() => handleDeleteAddress(address.id)}
                            sx={{
                              color: "#d32f2f",
                              "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.1)" },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
            <Box sx={{ textAlign: "right", marginTop: 3 }}>
              <Button variant="contained" color="primary" onClick={() => navigate("/tourist/add/address")} sx={{ borderRadius: "8px", padding: "8px 16px" }}>
                Add Address
              </Button>
            </Box>
          </Card>
        </Box>
      )}

      <Dialog open={redeemSuccess} onClose={handleCloseRedeemSuccess}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Typography>Your points have been successfully redeemed!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRedeemSuccess}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TouristProfile;
