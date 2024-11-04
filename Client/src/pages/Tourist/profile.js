import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, Card, CardContent, CardHeader, Dialog, DialogTitle, DialogContent, DialogActions, Avatar } from "@mui/material";
import { FaTrophy, FaShieldAlt, FaStarHalfAlt, FaCoins, FaCamera, FaEdit, FaPen } from "react-icons/fa";
import { getProfile, updateProfile, redeemPoints } from "../../services/tourist.js";
import { getUserId } from "../../utils/authUtils.js";
import Wallet from "./wallet";

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
  ];

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
          nationality: response.data.userProfile.nationality,
          birthDate: response.data.userProfile.birthDate,
          occupation: response.data.userProfile.occupation,
          gender: response.data.userProfile.gender || "",
          filepath: response.data.userProfile.profilePicture ? `http://localhost:8000/uploads/${userId}/${response.data.userProfile.profilePicture.filename}` : "",
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
      setUserProfile(response.data.userProfile);
      setRedeemSuccess(true);
    } catch (error) {
      console.error("Error redeeming points:", error);
      alert("Failed to redeem points. Please try again.");
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
          <Card sx={{ marginBottom: 4, borderRadius: "10px", padding: 3 }}>
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
            <CardHeader
              title="Loyalty Points"
              titleTypographyProps={{ variant: "h6" }}
              subheader={userProfile.loyaltyPoints <= 10000 ? "You need at least 10,000 points to redeem your points to cash." : null}
              subheaderTypographyProps={{
                variant: "body2",
                color: "text.secondary",
                sx: { marginTop: 0, marginBottom: -3, fontSize: 12 },
              }}
            />
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
            <Wallet walletAmount={userProfile.walletAmount} />
          </Card>

          <Card sx={{ borderRadius: "2px", padding: 3 }}>
            <CardHeader title="Profile Information" titleTypographyProps={{ variant: "h6", sx: { marginLeft: -2 } }} />
            <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
              <Box sx={{ position: "relative", marginRight: 2 }}>
                <Avatar
                  alt="Profile Picture"
                  src={
                    profilePicUrl  ||
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

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
              <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} disabled={!isEditing} onChange={handleChange} fullWidth sx={{ mr: 2 }} />
              <FormControl fullWidth sx={{ mx: 2 }}>
                <InputLabel>Nationality</InputLabel>
                <Select name="nationality" value={formData.nationality} disabled={!isEditing} onChange={handleChange}>
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
                disabled={!isEditing}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                sx={{ ml: 2 }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
              <TextField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} disabled={!isEditing} fullWidth sx={{ mr: 2 }} />
              <FormControl fullWidth sx={{ mx: 2 }}>
                <InputLabel>Gender</InputLabel>
                <Select name="gender" value={formData.gender} disabled={!isEditing} onChange={handleChange}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button variant="contained" onClick={() => setIsEditing(!isEditing)} sx={{ marginBottom: 2 }}>
              {isEditing ? "Save" : "Edit"}
            </Button>
          </Card>
        </Box>
      )}

      <Dialog open={redeemSuccess} onClose={handleCloseRedeemSuccess}>
        <DialogTitle>Success</DialogTitle>
        <DialogContent>
          <Typography>Your points have been successfully redeemed!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRedeemSuccess}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TouristProfile;
