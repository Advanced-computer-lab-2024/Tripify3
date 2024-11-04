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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { FaCheckCircle } from "react-icons/fa"; // Simplified import
import { getProfile, updateProfile } from "../../services/tourist.js"; 
import { getUserId } from "../../utils/authUtils.js";
import Wallet from "./wallet"; 

const TouristProfile = () => {
  const userId = getUserId();
  const [userProfile, setUserProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
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
    currencyPreference: "", // Ensure this matches your profile field
  });

  const countries = [
    "USA", "Canada", "UK", "Germany", "France", "Australia", "Egypt", "Italy",
    // Other countries...
  ];

  const currencies = [
    "USD", "CAD", "GBP", "EUR", "AUD", "EGP", "BRL", "ARS",
    // Other currencies...
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId);
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
          currencyPreference: response.data.userProfile.currencyPreference, // Ensure this matches the expected API field
          gender: response.data.userProfile.gender || "",
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

  return (
    <Box sx={{ padding: 7 }}>
      {userProfile && (
        <Box
          sx={{
            backgroundColor: "#fff",
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

          <Card sx={{ marginBottom: 4, borderRadius: "10px", padding: 0 }}>
            <CardHeader
              title="Loyalty Points"
              titleTypographyProps={{ variant: "h6" }}
            />
            <CardContent>
              <Wallet walletAmount={userProfile.walletAmount} />
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
                <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth disabled sx={{ mr: 2 }} />
                <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth disabled sx={{ mx: 2 }} />
                <TextField label="Name" value={`${formData.firstName} ${formData.lastName}`} disabled={!isEditing} fullWidth sx={{ ml: 2 }} />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 5 }}>
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  disabled={!isEditing}
                  onChange={handleChange}
                  fullWidth={false}
                  sx={{ width: "30%", mr: 2 }} 
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
                    sx={{ mb: 0.01 }} 
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Get a free gift on your birthday!
                  </Typography>
                </Box>
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

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <FormControl fullWidth sx={{ mr: 2 }}>
                  <InputLabel>Nationality</InputLabel>
                  <Select name="nationality" value={formData.nationality} onChange={handleChange} disabled={!isEditing} label="Nationality">
                    {countries.map((country) => (
                      <MenuItem key={country} value={country}>
                        {country}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ ml: 2 }}>
                  <InputLabel>Gender</InputLabel>
                  <Select name="gender" value={formData.gender} onChange={handleChange} disabled={!isEditing} label="Gender">
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Currency selection */}
              <FormControl fullWidth sx={{ mr: 2 }}>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currencyPreference" // Ensure the name matches the formData key
                  value={formData.currencyPreference} // Reference the correct state here
                  onChange={handleChange} // Verify that this updates state
                  disabled={!isEditing} // Disable if not editing
                  label="Currency"
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
                sx={{ backgroundColor: "#1976d2", color: "#fff", borderRadius: "20px" }}
              >
                {isEditing ? "Save" : "Edit Profile"}
              </Button>

              <Dialog open={redeemSuccess} onClose={() => setRedeemSuccess(false)}>
                <DialogTitle>Points Redeemed Successfully</DialogTitle>
                <DialogContent>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FaCheckCircle size={40} color="green" style={{ marginRight: "10px" }} />
                    <Typography variant="body1">
                      Your wallet balance is now {userProfile.walletAmount} EGP.
                    </Typography>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setRedeemSuccess(false)} color="primary">OK</Button>
                </DialogActions>
              </Dialog>
            </CardContent>
          </Card>

        </Box>
      )}
    </Box>
  );
};

export default TouristProfile;