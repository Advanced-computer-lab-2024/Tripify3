import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { getProfile, updateProfile } from "../../services/tourist.js"; // Import the API functions
import { getUserId } from "../../utils/authUtils.js";

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
    "Russia",
    "South Africa",
    "Nigeria",
    "Kenya",
    "Turkey",
    "Saudi Arabia",
    "United Arab Emirates",
    "Sweden",
    "Norway",
    "Finland",
    "Denmark",
    "Netherlands",
    "Belgium",
    "Switzerland",
    "Austria",
    "Greece",
    "Portugal",
    "Czech Republic",
    "Ireland",
    "Iceland",
    "Palestine",
    "Chile",
    "Colombia",
    "Peru",
    "Panama",
    "Costa Rica",
    "Cuba",
    "Honduras",
    "El Salvador",
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

          {/* First Row: Username, Email, Name */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
            <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth disabled sx={{ mr: 2 }} />
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth disabled sx={{ mx: 2 }} />
            <TextField label="Name" value={`${formData.firstName} ${formData.lastName}`} disabled={!isEditing}  fullWidth sx={{ ml: 2 }} />
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
                sx={{ mb: 0.01}} // Margin bottom for spacing
              />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Get offers on your special day!
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", width: "30%", justifyContent: "space-between" }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Gender
              </Typography>
              <Button
                variant={formData.gender === "Male" ? "contained" : "outlined"}
                onClick={() => setFormData({ ...formData, gender: "Male" })}
                disabled={!isEditing}
                sx={{ mr: 1 }} // Space between buttons
              >
                Male
              </Button>
              <Button variant={formData.gender === "Female" ? "contained" : "outlined"} onClick={() => setFormData({ ...formData, gender: "Female" })} disabled={!isEditing}>
                Female
              </Button>
            </Box>
          </Box>

          {/* Third Row: Nationality, Occupation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
            <FormControl fullWidth sx={{ mr: 2 }}>
              <InputLabel>Nationality</InputLabel>
              <Select label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} disabled={!isEditing}>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} fullWidth disabled={!isEditing} sx={{ ml: 2 }} />
          </Box>

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

export default TouristProfile;
