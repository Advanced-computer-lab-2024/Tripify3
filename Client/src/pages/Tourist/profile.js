import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { FaTrophy, FaShieldAlt, FaStarHalfAlt, FaCoins } from "react-icons/fa";
import { getProfile, updateProfile, redeemPoints } from "../../services/tourist.js"; 
import { getUserId } from "../../utils/authUtils.js";
import Wallet from "./wallet"; 

const TouristProfile = () => {
  const userId = getUserId();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
  });

  const countries = [
    "USA", "Canada", "UK", "Germany", "France", "Australia", "Egypt", "Italy",
    "Spain", "Brazil", "Argentina", "Mexico", "India", "China", "Japan",
    "South Korea", "Russia", "South Africa", "Nigeria", "Kenya", "Turkey",
    "Saudi Arabia", "United Arab Emirates", "Sweden", "Norway", "Finland",
    "Denmark", "Netherlands", "Belgium", "Switzerland", "Austria", "Greece",
    "Portugal", "Czech Republic", "Ireland", "Iceland", "Palestine", "Chile",
    "Colombia", "Peru", "Panama", "Costa Rica", "Cuba", "Honduras", "El Salvador",
    "Paraguay",
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
          gender: response.data.userProfile.gender || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(userId, formData);
      setUserProfile(response.data.userProfile);
      setIsEditing(false);
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
      setUserProfile(response.data.userProfile); // Update the user profile with new points
      alert('Points redeemed successfully!');
    } catch (error) {
      console.error("Error redeeming points:", error);
      alert('Failed to redeem points. Please try again.');
    }
  };
  

  return (
    <Box sx={{ padding: 7 }}>
      {userProfile && (
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: 3,
            maxWidth: "900px",
            margin: "auto",
          }}
        >
          <Typography variant="h6" sx={{ mb: 3 }}>
            Profile Information
          </Typography>

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

          <Card sx={{ marginBottom: 4, borderRadius: "10px", padding: 0}}>
            <CardHeader title="Loyalty Points" titleTypographyProps={{ variant: "h6" }} />
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#E3F2FD",
                  borderRadius: "20px",
                  padding: "10px 20px",
                }}
              >
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
          </Card>

          <Wallet walletAmount={userProfile.walletAmount} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
            <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth disabled sx={{ mr: 2 }} />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth disabled sx={{ mx: 2 }} />
            <TextField label="Name" value={`${formData.firstName} ${formData.lastName}`} disabled={!isEditing} fullWidth sx={{ ml: 2 }} />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              disabled={!isEditing}
              onChange={handleChange}
              fullWidth={false}
              sx={{ width: "30%", mr: 2 }} 
            />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "30%" }}>
              <TextField
                label="Birth Date"
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                fullWidth
                disabled={!isEditing}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 0.01 }} 
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Get a free gift on your birthday!
              </Typography>
            </Box>
            <Box sx={{ width: "30%" }}>
              <FormControl fullWidth disabled={!isEditing}>
                <InputLabel>Gender</InputLabel>
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  sx={{ mr: 2 }}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ display: "flex", mb: 5 }}>
            <FormControl fullWidth disabled={!isEditing}>
              <InputLabel>Nationality</InputLabel>
              <Select
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {isEditing ? (
              <>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)} sx={{ ml: 2 }}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default TouristProfile;
