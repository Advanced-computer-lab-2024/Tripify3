import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Avatar, Card, IconButton } from "@mui/material";
import { FaCamera } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { getProfile, updateProfile } from "../../services/advertiser.js"; // Make sure to update the API service file
import { getUserId } from "../../utils/authUtils.js";

const AdvertiserProfile = () => {
  const userId = getUserId();
  const [user, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null); // New profile picture (file or null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    companyName: "",
    websiteLink: "",
    hotline: "",
    files: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId);
        setUserProfile(response.data.user);
        const userData = response.data.user;
        const files = response.data.user.files || [];

        setFormData({
          username: response.data.user.username,
          email: response.data.user.email,
          companyName: response.data.user.companyName,
          websiteLink: response.data.user.websiteLink,
          hotline: response.data.user.hotline,
          files: files,
        });
        // Check if profilePicture exists before setting the profilePicUrl
        if (userData.profilePicture && userData.profilePicture.filename) {
          setProfilePicUrl(`http://localhost:8000/uploads/${userId}/${userData.profilePicture.filename}`);
        } else {
          setProfilePicUrl(""); // Set to an empty string if there's no profile picture
        }
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

  const handleProfilePicChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setNewProfilePic(file); // Save file temporarily
      setProfilePicUrl(URL.createObjectURL(file)); // Update preview
    }
  };

  const handleDeleteProfilePic = () => {
    setNewProfilePic(null); // Mark picture for deletion
    setProfilePicUrl(""); // Clear preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any form data has changed
    const hasProfileChanges =
      formData.username !== user.username ||
      formData.email !== user.email ||
      formData.companyName !== user.companyName ||
      formData.websiteLink !== user.websiteLink ||
      formData.hotline !== user.hotline ||
      formData.files.length !== user.files.length; // Add more checks if needed

    try {
      // Update profile info if any profile data has changed
      if (hasProfileChanges) {
        await updateProfile(userId, formData);
      }

      // Handle profile picture update or deletion
      if (newProfilePic) {
        const pictureFormData = new FormData();
        pictureFormData.append("userId", userId);
        pictureFormData.append("file", newProfilePic);

        await axios.put("http://localhost:8000/user/upload/picture", pictureFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (newProfilePic === null && profilePicUrl === "" && user.profilePicture) {
        // Only delete if the picture was specifically marked for deletion
        await axios.delete("http://localhost:8000/user/remove/picture", {
          data: { userId: userId },
        });
      }

      // Update the user state with the new data
      const userProfile = await getProfile(userId);
      setUserProfile(userProfile.data.user); // Set the updated profile data

      console.log(userProfile.data.user);
      

      // Update local state instead of reloading the page
      setProfilePicUrl(newProfilePic ? URL.createObjectURL(newProfilePic) : profilePicUrl); // Keep existing profile picture if unchanged
      setIsEditing(false); // Exit edit mode
      setNewProfilePic(null); // Clear temporary file state
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };


  return (
    <Box sx={{ padding: 7 }}>
      {user ? (
        <Box sx={{ maxWidth: "700px", margin: "auto" }}>
          <Card sx={{ borderRadius: "10px", padding: 3, textAlign: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar alt="Profile Picture" src={profilePicUrl || ""} sx={{ width: 90, height: 90 }}>
                  {formData.companyName.charAt(0)}
                </Avatar>
                {isEditing && (
                  <>
                    <IconButton style={{ position: "absolute", bottom: -10, right: -10 }} component="label">
                      <FaCamera />
                      <input type="file" accept="image/*" onChange={handleProfilePicChange} hidden />
                    </IconButton>
                    {profilePicUrl && (
                      <IconButton onClick={handleDeleteProfilePic} style={{ position: "absolute", bottom: -10, left: -10 }}>
                        <MdDelete color="red" />
                      </IconButton>
                    )}
                  </>
                )}
              </Box>
              <Typography variant="h5">@{formData.username}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <TextField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} disabled={!isEditing} fullWidth />
              <TextField label="Email" name="email" value={formData.email} disabled fullWidth sx={{ ml: 2 }} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <TextField label="Website Link" name="websiteLink" value={formData.websiteLink} onChange={handleChange} disabled={!isEditing} fullWidth />
              <TextField label="Hotline" name="hotline" value={formData.hotline} onChange={handleChange} disabled={!isEditing} fullWidth sx={{ ml: 2 }} />
            </Box>

            <Button variant="contained" onClick={isEditing ? handleSubmit : () => setIsEditing(true)}>
              {isEditing ? "Save" : "Edit Profile"}
            </Button>
          </Card>
        </Box>
      ) : (
        <Typography variant="h6">Loading...</Typography>
      )}
    </Box>
  );
};

export default AdvertiserProfile;
