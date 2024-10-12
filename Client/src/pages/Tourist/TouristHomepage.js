import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { getProfile, updateProfile } from "../../services/tourist.js"; // Import the API functions
import { getUserId } from "../../utils/authUtils.js";

const TouristHomePage = () => {
  const userId = getUserId(); // Replace with dynamic user ID as necessary
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    nationality: "",
    birthDate: "",
    occupation: "",
  });

  const countries = [
    "USA", "Canada", "UK", "Germany", "France", "Australia", "Egypt", "Italy", "Spain", "Brazil", "Argentina", 
    "Mexico", "India", "China", "Japan", "South Korea", "Russia", "South Africa", "Nigeria", "Kenya", "Turkey", 
    "Saudi Arabia", "United Arab Emirates", "Sweden", "Norway", "Finland", "Denmark", "Netherlands", "Belgium", 
    "Switzerland", "Austria", "Greece", "Portugal", "Czech Republic", "Ireland", "Iceland", "Palestine", "Chile", 
    "Colombia", "Peru", "Panama", "Costa Rica", "Cuba", "Honduras", "El Salvador", "Paraguay"
  ];

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId);
        setUserProfile(response.data.userProfile);
        // Initialize formData with fetched profile data
        setFormData({
          phoneNumber: response.data.userProfile.phoneNumber,
          nationality: response.data.userProfile.nationality,
          birthDate: response.data.userProfile.birthDate,
          occupation: response.data.userProfile.occupation,
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

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Tourist Profile</Typography>
      
      {userProfile && (
        <Box
          sx={{
            border: "1px solid #ccc",
            padding: 3,
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            maxWidth: 600,
            margin: "auto",
          }}
        >
          <Typography variant="h6">Profile Information</Typography>
          <TextField
            label="Username"
            value={userProfile.username}
            fullWidth
            disabled
            sx={{ my: 2 }}
          />
          <TextField
            label="Email"
            value={userProfile.email}
            fullWidth
            disabled
            sx={{ my: 2 }}
          />

          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            sx={{ my: 2 }}
          />

          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel>Nationality</InputLabel>
            <Select
              label="Nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              disabled={!isEditing}
            >
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
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            InputLabelProps={{ shrink: true }}
            sx={{ my: 2 }}
          />

          <TextField
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            fullWidth
            disabled={!isEditing}
            sx={{ my: 2 }}
          />

          {isEditing ? (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save
            </Button>
          ) : (
            <Button variant="outlined" color="secondary" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default TouristHomePage;
