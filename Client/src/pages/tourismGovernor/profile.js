import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Card, CardHeader, Avatar, IconButton, InputAdornment } from "@mui/material";
import { FaCamera, FaEye, FaEyeSlash } from "react-icons/fa";
import { getProfile, changePassword } from "../../services/tourismGovernor.js";
import { getUserId } from "../../utils/authUtils.js";

const TourismGovernorProfile = () => {
  const userId = getUserId();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId);
        setUserProfile(response.data.user);
        setFormData({
          username: response.data.user.username,
          password: response.data.user.password,
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

  return (
    <Box sx={{ padding: 7 }}>
      {userProfile && (
        <Box sx={{ maxWidth: "600px", margin: "auto" }}>
          <Card sx={{ borderRadius: "10px", padding: 3 }}>
            <CardHeader title="Profile Information" titleTypographyProps={{ variant: "h6", sx: { marginLeft: -2 } }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField label="Username" name="username" value={formData.username} disabled fullWidth />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={!isEditing}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <FaEye /> : <FaEyeSlash />}</IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default TourismGovernorProfile;
