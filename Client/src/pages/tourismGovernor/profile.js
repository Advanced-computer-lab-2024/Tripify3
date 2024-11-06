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

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", file);

      try {
        const response = await axios.put("http://localhost:8000/user/upload/picture", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const uploadedImageUrl = `http://localhost:8000/uploads/${userId}/${response.data.profilePicture.filename}`;
        setProfilePicUrl(uploadedImageUrl);
      } catch (error) {
        console.error("Error uploading the image:", error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      await changePassword({
        username: formData.username,
        oldPassword: userProfile.password, // Assuming the existing password is used as oldPassword
        newPassword: formData.password,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <Box sx={{ padding: 7 }}>
      {userProfile && (
        <Box sx={{ maxWidth: "600px", margin: "auto" }}>
          <Card sx={{ borderRadius: "10px", padding: 3 }}>
            <CardHeader title="Profile Information" titleTypographyProps={{ variant: "h6", sx: { marginLeft: -2 } }} />
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
              <Box sx={{ position: "relative", marginRight: 2 }}>
                <Avatar
                  alt="Profile Picture"
                  src={
                    profilePicUrl ||
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
                      <IconButton onClick={() => setShowPassword((prev) => !prev)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => {
                if (isEditing) handleSubmit();
                setIsEditing(!isEditing);
              }}
              sx={{ marginTop: 2 }}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default TourismGovernorProfile;
