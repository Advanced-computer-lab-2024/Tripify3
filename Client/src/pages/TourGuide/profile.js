import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, Card, CardContent, CardHeader, Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from "@mui/material";
import { FaTrophy, FaShieldAlt, FaStarHalfAlt, FaCoins, FaCamera, FaEdit, FaPen } from "react-icons/fa";
import { getProfile, updateProfile } from "../../services/tourGuide.js";
import { getUserId } from "../../utils/authUtils.js";

const TouristProfile = () => {
  const userId = getUserId();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    yearsOfExperience: "",
    previousWork: "",
    licenseNumber: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId);
        console.log(response);
        const fullName = response.data.userProfile.name.split(" ");
        setUserProfile(response.data.userProfile);

        setFormData({
          username: response.data.userProfile.username,
          email: response.data.userProfile.email,
          firstName: fullName[0],
          lastName: fullName[1] || "",
          phoneNumber: response.data.userProfile.phoneNumber,
          yearsOfExperience: response.data.userProfile.yearsOfExperience,
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
      // Create a FileReader to preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        // setProfilePic(reader.result); // Set the preview URL
      };
      reader.readAsDataURL(file);

      // Upload the image to the server using axios
      const formData = new FormData();
      formData.append("userId", userId); // Append the user ID
      formData.append("file", file); // Append the image f

      try {
        const response = await axios({
          method: "put",
          url: "http://localhost:8000/user/upload/picture",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type for file upload
          },
        });
        // Assuming your server responds with the file path
        const uploadedFilepath = response.data.profilePicture.filepath;
        const uploadedImageUrl = `http://localhost:8000/uploads/${userId}/${response.data.profilePicture.filename}`;

        // Update the profile picture URL in state to refresh the avatar
        setProfilePicUrl(uploadedImageUrl);
      } catch (error) {
        console.error("Error uploading the image:", error);
      }
    }
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

  const handleCloseRedeemSuccess = () => {
    setRedeemSuccess(false);
  };

  return (
    <Box sx={{ padding: 7 }}>
      {userProfile && (
        <Box
          sx={{
            maxWidth: "900px",
            margin: "auto",
          }}
        >
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
                  } // Use default image if no profile picture
                  sx={{ width: 70, height: 70 }}
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


            <Button variant="contained" onClick={() => setIsEditing(!isEditing)} sx={{ marginBottom: 2 }}>
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Card>
        </Box>
      )}

    
    </Box>
  );
};

export default TouristProfile;
