import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Avatar, Card, IconButton } from "@mui/material";
import { FaCamera } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { getProfile, updateProfile } from "../../services/tourGuide.js";
import { getUserId } from "../../utils/authUtils.js";

const TourGuideProfile = () => {
  const userId = getUserId();
  const [user, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null); // New profile picture (file or null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    yearsOfExperience: "",
    previousWork: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId);
        setUserProfile(response.data.user);
        const userData = response.data.user;
        const previousWork = response.data.user.previousWork || [];

        setFormData({
          username: response.data.user.username,
          email: response.data.user.email,
          fullName: response.data.user.name,
          phoneNumber: response.data.user.phoneNumber,
          yearsOfExperience: response.data.user.yearsOfExperience,
          previousWork: previousWork,
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
    if (name.startsWith("previousWork-")) {
      const index = parseInt(name.split("-")[1]);
      const newPreviousWork = [...formData.previousWork];
      newPreviousWork[index] = value;
      setFormData((prev) => ({ ...prev, previousWork: newPreviousWork }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
    const filteredPreviousWork = formData.previousWork.filter((work) => work.trim() !== "");

    try {
      // 1. Update profile info
      const response = await updateProfile(userId, {
        ...formData,
        previousWork: filteredPreviousWork,
      });

      const userProfile = await getProfile(userId);

      // 2. Handle profile picture upload or deletion
      if (newProfilePic) {
        const pictureFormData = new FormData();
        pictureFormData.append("userId", userId);
        pictureFormData.append("file", newProfilePic);

        await axios.put("http://localhost:8000/user/upload/picture", pictureFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (newProfilePic === null && profilePicUrl === "") {
        await axios.delete("http://localhost:8000/user/remove/picture", {
          data: { userId: userId },
        });
      }

      // 3. Update the user state with the new data
      setUserProfile(userProfile.data.user); // Set the updated profile data

      // 4. Update local state instead of reloading the page
      setProfilePicUrl(newProfilePic ? URL.createObjectURL(newProfilePic) : ""); // Show updated profile picture
      setIsEditing(false); // Exit edit mode
      setNewProfilePic(null); // Clear temporary file state
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleRemovePreviousWork = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      previousWork: prevData.previousWork.filter((_, i) => i !== index), // Filter out the work at the given index
    }));
  };

  const handleAddPreviousWork = () => {
    setFormData((prevData) => ({
      ...prevData,
      previousWork: [...prevData.previousWork, ""],
    }));
  };

  return (
    <Box sx={{ padding: 7 }}>
      {user ? (
        <Box sx={{ maxWidth: "700px", margin: "auto" }}>
          <Card sx={{ borderRadius: "10px", padding: 3, textAlign: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 2 }}>
              <Box sx={{ position: "relative" }}>
                <Avatar alt="Profile Picture" src={profilePicUrl || ""} sx={{ width: 90, height: 90 }}>
                  {formData.fullName.charAt(0)}
                </Avatar>
                {isEditing && (
                  <>
                    <IconButton style={{ position: "absolute", bottom: -10, right: -10 }} component="label">
                      <FaCamera />
                      <input type="file" accept="image/*" onChange={handleProfilePicChange} hidden />
                    </IconButton>
                    {profilePicUrl && (
                      <>
                        <IconButton onClick={handleDeleteProfilePic} style={{ position: "absolute", bottom: -10, left: -10 }}>
                          <MdDelete color="red" />
                        </IconButton>
                      </>
                    )}
                  </>
                )}
              </Box>
              <Typography variant="h5">@{formData.username}</Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <TextField label="Full Name" value={formData.fullName} onChange={handleChange} disabled={!isEditing} fullWidth />

              <TextField label="Email" name="email" value={formData.email} disabled fullWidth sx={{ ml: 2 }} />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <TextField label="Years of Experience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} disabled={!isEditing} fullWidth />
              <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={!isEditing} fullWidth sx={{ ml: 2 }} />
            </Box>

            <Box sx={{ mb: 2 }}>
              {formData.previousWork.map((work, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <TextField label={`Previous Work ${index + 1}`} name={`previousWork-${index}`} value={work} onChange={handleChange} disabled={!isEditing} fullWidth sx={{ mr: 1 }} />
                  {isEditing && (
                    <Button variant="outlined" color="error" onClick={() => handleRemovePreviousWork(index)}>
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              {isEditing && (
                <Button variant="contained" onClick={handleAddPreviousWork} sx={{ mt: 1 }}>
                  Add Previous Work
                </Button>
              )}
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

export default TourGuideProfile;
