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
import { FaTrophy, FaShieldAlt, FaStarHalfAlt, FaCoins } from "react-icons/fa"; // Adding coin icon for points
import { getProfile, updateProfile } from "../../services/tourist.js"; // Import the API functions
import { getUserId } from "../../utils/authUtils.js";
import Wallet from "./wallet"; // Import the Wallet component

const TouristProfile = () => {
  const userId = getUserId(); // Replace with dynamic user ID as necessary
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

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId);
        const fullName = response.data.userProfile.name.split(" ");
        setUserProfile(response.data.userProfile);
        // Initialize formData with fetched profile data
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateProfile(userId, formData);
      setUserProfile(response.data.userProfile); // Update local userProfile with the new data
      setIsEditing(false); // Stop editing mode
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Function to get badge level based on loyalty points
  const getBadgeInfo = (points) => {
    if (points > 500000) {
      return { level: 3, text: "Congratulations! You are a Loyalty Master! Keep it up!", icon: <FaTrophy size={40} color="#FFD700" /> };
    } else if (points > 100000) {
      return { level: 2, text: "Great job! You are a Loyalty Pro! Keep collecting points!", icon: <FaShieldAlt size={40} color="#C0C0C0" /> };
    } else {
      return { level: 1, text: "Welcome! You are just starting your loyalty journey! Collect points to level up!", icon: <FaStarHalfAlt size={40} color="#D3D3D3" /> };
    }
  };

  // Get badge info based on user's loyalty points
  const badgeInfo = userProfile ? getBadgeInfo(userProfile.loyaltyPoints) : { level: 1, text: "", icon: null };

  return (
    <Box sx={{ padding: 7 }}>
      {userProfile && (
        <Box
          sx={{
            backgroundColor: "#fff", // White background
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

          {/* Badge Section */}
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

          {/* Loyalty Points Section with Icon */}
          <Card sx={{ marginBottom: 4, borderRadius: "10px", padding: 2 }}>
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
                variant="outlined" // Change to outlined for a border effect
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)", // Near-white background
                  borderColor: "#1976d2", // Border color
                  color: "#1976d2", // Text color
                  borderRadius: "20px", // Make it oval
                  padding: "8px 16px", // Padding for button
                  marginLeft: 2,
                  transition: "background-color 0.3s", 
                  "&:hover": {
                    backgroundColor: "#1976D2", 
                    color: "#fff", 
                  },
                }}
                onClick={() => console.log("Redeem points")} // Handle redeem logic here
              >
                Redeem
              </Button>
            </CardContent>
          </Card>

          {/* Wallet Component */}
          <Wallet walletAmount={userProfile.walletAmount} /> {/* Pass the wallet amount as a prop */}

          {/* First Row: Username, Email, Name */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
            <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth disabled sx={{ mr: 2 }} />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth disabled sx={{ mx: 2 }} />
            <TextField label="Name" value={`${formData.firstName} ${formData.lastName}`} disabled={!isEditing} fullWidth sx={{ ml: 2 }} />
          </Box>

          {/* Second Row: Phone Number, Birth Date, Gender */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              disabled={!isEditing}
              onChange={handleChange}
              fullWidth={false} // Disable fullWidth for custom width
              sx={{ width: "30%", mr: 2 }} // Set a specific width for the phone number
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
                sx={{ mb: 0.01 }} // Margin bottom for spacing
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Get a free gift on your birthday!
              </Typography>
            </Box>

            {/* Gender Selection */}
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

          {/* Third Row: Nationality and Occupation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
            <FormControl fullWidth sx={{ mr: 2 }} disabled={!isEditing}>
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
            <TextField
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              fullWidth
              disabled={!isEditing}
              sx={{ ml: 2 }}
            />
          </Box>

          {/* Save or Edit Button */}
          {isEditing ? (
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          ) : (
            <Button variant="outlined" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TouristProfile;
