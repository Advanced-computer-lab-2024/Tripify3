import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button, CircularProgress, Grid, Card, CardContent, CardActions, Chip, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { LocationOn as LocationOnIcon } from "@mui/icons-material";
import { updateActivity, getAllCategories, getAllTags } from "../../services/advertiser.js";
import { getActivityById } from "../../services/tourist";
import { getUserId, getUserType } from "../../utils/authUtils";

// Function to render stars based on rating
const renderStars = (rating) => {
  const totalStars = 5; // Total number of stars
  const filledStars = Math.round(rating); // Round rating to the nearest integer for full stars
  const stars = [];

  for (let i = 0; i < totalStars; i++) {
    stars.push(i < filledStars ? "★" : "☆");
  }
  return stars.join(" "); // Return a string of stars
};

const AdvertiserActivityDetails = () => {
  const { id } = useParams();
  const userType = getUserType();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [specialDiscount, setSpecialDiscount] = useState(0);
  const userId = getUserId();
  const [bookings, setBookings] = useState([]); // Initialize bookings as an empty array

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await getActivityById(id);
        const activityData = response.data?.data?.activity || null;
        setActivity(activityData);
        setTitle(activityData?.name || "");
        setLocation(activityData?.location || "");
        setSpecialDiscount(activityData?.specialDiscount || 0);
        setSelectedCategory(activityData?.category?._id || "");
        setSelectedTags(activityData?.tags?.map((tag) => tag._id) || []);
        setLoading(false);
      } catch (error) {
        setError("Error fetching activity details");
        setLoading(false);
      }
    };

    const fetchCategoriesAndTags = async () => {
      try {
        const [categoriesResponse, tagsResponse] = await Promise.all([getAllCategories(), getAllTags()]);
        setCategories(categoriesResponse.data || []);
        setTags(tagsResponse.data?.tags || []);
      } catch (error) {
        console.error("Error fetching categories or tags:", error);
      }
    };

    const fetchBookingsForActivity = async () => {
      try {
        console.log(id);
        const response = await axios.get(`http://localhost:8000/activity/get/bookings/${id}`);
        console.log(response.data.bookings);
        console.log("==================");

        setBookings(response.data.bookings); // Store the fetched bookings
      } catch (err) {
        console.error("Error fetching bookings", err);
      }
    };

    fetchBookingsForActivity();

    fetchActivityData();
    fetchCategoriesAndTags();
  }, [id]);

  const handleUpdateToggle = () => setEditMode((prev) => !prev);

  const activateActivity = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/activity/activate/${id}`);
      console.log(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error(error.response?.data?.message || "Error activating itinerary");
    }
  };

  // Deactivate an itinerary
  const deactivateActivity = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/activity/deactivate/${id}`);
      console.log(response.data.message);
      window.location.reload();
    } catch (error) {
      console.error(error.response?.data?.message || "Error deactivating itinerary");
    }
  };

  const handleSave = async () => {
    try {
      await updateActivity(id, {
        name: title,
        location,
        specialDiscount,
        category: selectedCategory,
        tags: selectedTags,
      });
      alert("Activity updated successfully!");
      setEditMode(false); // Close edit mode
      window.location.reload();
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#F5F7FA", minHeight: "100vh", position: "relative" }}>
      <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ position: "absolute", top: 16, left: 16 }}>
        Go Back
      </Button>
  
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start", mt: 5 }}>
        <Card sx={{ width: "100%", maxWidth: "900px", borderRadius: 3, boxShadow: 5, padding: 4, minHeight: "500px", position: "relative" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography
                variant="h4"
                color="#333"
                gutterBottom
                textAlign={!editMode ? "center" : "left"}
                sx={{ mb: 3, width: "100%" }}
              >
                {editMode ? (
                  <TextField label="Activity Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={{ mb: 2 }} />
                ) : (
                  activity?.name || "Activity Name"
                )}
              </Typography>
              <Button variant="contained" color="success" onClick={handleUpdateToggle}>
                {editMode ? "Cancel" : "Edit"}
              </Button>
            </Box>
  
            {/* Special Discount */}
            {activity?.specialDiscount > 0 && !editMode && (
              <Box sx={{ backgroundColor: "#E2F0E6", color: "#2C7A7B", borderRadius: 2, padding: "12px", textAlign: "center", mb: 4, fontWeight: 600 }}>
                Special Discount: {activity.specialDiscount}%
              </Box>
            )}
  
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500, mb: 1 }}>
                  Location
                </Typography>
                {editMode ? (
                  <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth sx={{ mb: 2 }} />
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOnIcon sx={{ color: "#5A67D8", mr: 1 }} />
                    <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500 }}>
                      {activity?.location || "Location"}
                    </Typography>
                  </Box>
                )}
              </Grid>
  
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500, mb: 1 }}>
                  Category
                </Typography>
                {editMode ? (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="Category">
                      {categories.map((category) => (
                        <MenuItem key={category._id} value={category._id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {activity?.category?.name || "No category"}
                  </Typography>
                )}
              </Grid>
  
              {editMode && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500, mb: 1 }}>
                    Special Discount
                  </Typography>
                  <TextField type="number" label="Special Discount (%)" value={specialDiscount} onChange={(e) => setSpecialDiscount(e.target.value)} fullWidth sx={{ mb: 2 }} />
                </Grid>
              )}
  
              {/* Rating Display */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500, mb: 1 }}>
                  Rating
                </Typography>
                {!editMode && (
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "gold" }}>
                    {activity?.rating ? renderStars(activity.rating) : "No rating yet"}
                  </Typography>
                )}
              </Grid>
  
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: "#4A5568", fontWeight: 500, mb: 1 }}>
                  Tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {editMode
                    ? tags.map((tag) => (
                        <Chip
                          key={tag._id}
                          label={tag.name}
                          clickable
                          onClick={() =>
                            setSelectedTags((prevTags) =>
                              prevTags.includes(tag._id) ? prevTags.filter((id) => id !== tag._id) : [...prevTags, tag._id]
                            )
                          }
                          color={selectedTags.includes(tag._id) ? "primary" : "default"}
                        />
                      ))
                    : activity?.tags?.map((tag) => <Chip key={tag._id} label={tag.name} color="default" />)}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
  
          {editMode && (
            <CardActions sx={{ justifyContent: "flex-end", padding: "24px 32px" }}>
              <Button variant="contained" color="primary" onClick={handleSave} sx={{ px: 4 }}>
                Save Changes
              </Button>
            </CardActions>
          )}
  
          {userType === "Advertiser" && !editMode && (
            <Box sx={{ position: "absolute", bottom: 16, right: 16 }}>
              {activity.status === "Active" ? (
                <Button variant="contained" color="success" onClick={deactivateActivity}>
                  Deactivate
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={activateActivity}>
                  Activate
                </Button>
              )}
            </Box>
          )}
        </Card>
      </Box>
    </Box>
  );
  
};

export default AdvertiserActivityDetails;
