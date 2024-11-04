import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { FaCamera } from "react-icons/fa";
import { getProfile, updateProfile } from "../../services/tourGuide.js";
import { getUserId } from "../../utils/authUtils.js";

const TouristProfile = () => {
  const userId = getUserId();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    yearsOfExperience: "",
    previousWork: [], // This should be an array
    licenseNumber: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId);
        console.log(response);
        const fullName = response.data.userProfile.name.split(" ");
        setUserProfile(response.data.userProfile);
        const previousWork = response.data.userProfile.previousWork || [];

        setFormData({
          username: response.data.userProfile.username,
          email: response.data.userProfile.email,
          firstName: fullName[0],
          lastName: fullName[1] || "",
          phoneNumber: response.data.userProfile.phoneNumber,
          yearsOfExperience: response.data.userProfile.yearsOfExperience,
          previousWork: previousWork, // Set previousWork from the profile
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("previousWork-")) {
      const index = parseInt(name.split("-")[1]); // Get index from name
      const newPreviousWork = [...formData.previousWork];
      newPreviousWork[index] = value; // Update specific entry
      setFormData((prev) => ({ ...prev, previousWork: newPreviousWork }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Optional: preview the image if needed
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("userId", userId); // Append the user ID
      formData.append("file", file); // Append the image file

      try {
        const response = await axios.put("http://localhost:8000/user/upload/picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const uploadedImageUrl = `http://localhost:8000/uploads/${userId}/${response.data.profilePicture.filename}`;
        setProfilePicUrl(uploadedImageUrl); // Update the profile picture URL in state
      } catch (error) {
        console.error("Error uploading the image:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty previous work entries before submission
    const filteredPreviousWork = formData.previousWork.filter(work => work.trim() !== "");

    try {
      const response = await updateProfile(userId, {
        ...formData,
        previousWork: filteredPreviousWork, // Include only non-empty entries
      });
      setUserProfile(response.data.userProfile);
      setIsEditing(false);
      window.location.reload(); // Refresh the page after saving
    } catch (error) {
      console.error("Error updating profile:", error);
      // Optionally show a message to the user about the error
    }
  };

  const handleRemovePreviousWork = (index) => {
    const newPreviousWork = formData.previousWork.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, previousWork: newPreviousWork }));
  };

  const handleAddPreviousWork = () => {
    setFormData((prevData) => ({
      ...prevData,
      previousWork: [...prevData.previousWork, ""], // Add an empty string for a new entry
    }));
  };

  return (
    <Box sx={{ padding: 7 }}>
      {userProfile ? (
        <Box sx={{ maxWidth: "900px", margin: "auto" }}>
          <Card sx={{ borderRadius: "10px", padding: 3 }}>
            <CardHeader
              title="Profile Information"
              titleTypographyProps={{ variant: "h6", sx: { marginLeft: -2 } }}
            />
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
              <Box sx={{ position: "relative", marginRight: 2 }}>
                <Avatar
                  alt="Profile Picture"
                  src={profilePicUrl || "default_profile_pic_url"} // Provide default image if no profile picture
                  sx={{ width: 70, height: 70 }}
                />
                <label
                  htmlFor="profile-pic-upload"
                  style={{ position: "absolute", bottom: 5, right: -3, cursor: "pointer" }}
                >
                  <FaCamera size={18} color="gray" />
                </label>
                <input
                  id="profile-pic-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                  style={{ display: "none" }}
                />
              </Box>
              <Typography variant="h5" marginLeft={-1}>
                @{formData.username}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5, marginTop: 4 }}>
              <TextField
                label="Name"
                value={`${formData.firstName} ${formData.lastName}`}
                disabled
                fullWidth
                sx={{ ml: 0 }}
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                fullWidth
                sx={{ mx: 2 }}
              />
              <TextField
                label="Years of Experience"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                disabled={!isEditing}
                fullWidth
                sx={{ mx: 4 }}
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                fullWidth
                sx={{ mx: 2 }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              {formData.previousWork.map((work, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <TextField
                    label={`Previous Work ${index + 1}`}
                    name={`previousWork-${index}`} // Unique name for each field
                    value={work} // Set value from the array
                    onChange={handleChange} // Ensure this updates correctly
                    disabled={!isEditing}
                    fullWidth
                    sx={{ mx: 2 }} // Adjust margins as needed
                  />
                  {isEditing && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemovePreviousWork(index)}
                      sx={{ marginLeft: 1 }} // Space between input and remove button
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
            </Box>

            {/* Button to add a new previous work entry */}
            {isEditing && (
              <Box sx={{ marginBottom: 2 }}> {/* Add margin bottom for spacing */}
                <Button
                  variant="contained"
                  onClick={handleAddPreviousWork}
                  sx={{ marginBottom: 2 }}
                >
                  Add Previous Work
                </Button>
              </Box>
            )}

            <Button
              variant="contained"
              onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
              sx={{ marginBottom: 2, marginLeft: 2 }}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Card>
        </Box>
      ) : (
        <Typography variant="h6">Loading...</Typography>
      )}
    </Box>
  );
};

export default TouristProfile;
