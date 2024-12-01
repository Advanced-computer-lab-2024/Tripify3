import React, { useState, useEffect, useRef } from "react";
import { createActivity, getAllCategories, getAllTags } from "../../services/advertiser.js";
import { getUserId } from "../../utils/authUtils.js";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Modal, Typography, Checkbox, FormControlLabel, FormControl, FormGroup, Select, MenuItem, InputLabel, CircularProgress, Grid } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

// Set default icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const AdvertiserAddActivity = () => {
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    price: "",
    category: "",
    specialDiscount: "",
    duration: "",
  });

  const [editingActivityId, setEditingActivityId] = useState(null);
  const mapRef = useRef(null);
  const userId = getUserId();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await getAllTags();
      setTags(response.data.tags);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTags();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleAddActivity = async () => {
    try {
      await createActivity({
        ...newActivity,
        advertiser: userId,
        tags: selectedTags,
        duration: parseInt(newActivity.duration),
      });
      setNewActivity({
        name: "",
        date: "",
        time: "",
        location: "",
        price: "",
        category: "",
        specialDiscount: "",
        duration: "",
      });
      setSelectedTags([]);
      setOpenModal(true); // Open the modal after successful activity creation
    } catch (error) {
      console.error("Failed to add activity:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddActivity(); // Call handleAddActivity on form submission
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    window.location.href = "../my-activities";
  };

  const handleLocationClick = () => {
    navigate("/location-selection");
  };

  useEffect(() => {
    const cairoCoordinates = { lat: 30.0444, lng: 31.2357 };
    const map = L.map(mapRef.current).setView([cairoCoordinates.lat, cairoCoordinates.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    let marker;
    map.on("click", function (e) {
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker(e.latlng).addTo(map);
      setLocation("Fetching address...");
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const reverseGeocode = (lat, lng) => {
    setLoadingAddress(true);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((response) => response.json())
      .then((data) => {
        setLocation(data.display_name);
        setNewActivity((prevActivity) => ({
          ...prevActivity,
          location: data.display_name,
        }));
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoadingAddress(false));
  };
  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2.5em", marginBottom: "30px", textAlign: "center", fontWeight: "bold" }}>Add New Activity</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Activity Name"
          name="name"
          value={newActivity.name}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          type="date"
          name="date"
          value={newActivity.date}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
          InputProps={{ inputProps: { min: new Date().toISOString().split("T")[0] } }}
        />
        <TextField
          fullWidth
          type="time"
          name="time"
          value={newActivity.time}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
        />
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Pin the Location</Typography>
          <Box
            ref={mapRef}
            sx={{
              height: 350,
              width: "100%",
              mb: 2,
              borderRadius: "10px",
              border: "2px solid #00796b",
            }}
          />
          <TextField
            fullWidth
            label="Location Address"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setNewActivity({ ...newActivity, location: e.target.value });
            }}
            required
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: loadingAddress && (
                <CircularProgress size={20} sx={{ color: "#00796b", ml: 1 }} />
              ),
            }}
          />
        </Box>
        <TextField
          fullWidth
          label="Price"
          name="price"
          value={newActivity.price}
          onChange={handleInputChange}
          type="number" 
          inputProps={{ min: 1 }}
          sx={{ mb: 2 }}
          required
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={newActivity.category}
            onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
            required
          >
            <MenuItem value="">Select a category</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Tags Section: Limit to 3 tags per row */}
        <FormGroup sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Tags</Typography>
          <Grid container spacing={1} columns={{ xs: 4, sm: 6, md: 12 }}>
            {tags.map((tag) => (
              <Grid item xs={4} sm={4} md={4} key={tag._id}> {/* 3 tags per row */}
                <Button
                  variant="contained"
                  onClick={() => handleTagChange(tag._id)}
                  sx={{
                    width: "100%",
                    bgcolor: selectedTags.includes(tag._id) ? "green" : "gray",
                    color: "white",
                    ":hover": { bgcolor: selectedTags.includes(tag._id) ? "darkgreen" : "darkgray" },
                  }}
                >
                  {tag.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </FormGroup>

        {/* Single Special Discount Field */}
        <TextField
          fullWidth
          label="Special Discount %"
          name="specialDiscount"
          value={newActivity.specialDiscount}
          onChange={handleInputChange}
          type="number" 
          inputProps={{ min: 1, max: 100 }}
          sx={{ mb: 2 }}
        />
    
        <TextField
          fullWidth
          label="Duration (minutes)"
          name="duration"
          type="number"
          value={newActivity.duration}
          onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
          sx={{ mb: 2 }}
          required
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mb: 3, bgcolor: "#00796b", ":hover": { bgcolor: "#004d40" } }}
        >
          Submit Activity
        </Button>
      </form>

      {/* Success Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <Typography id="success-modal-title" variant="h5" component="h2" sx={{ mb: 2, fontWeight: "bold" }}>
            Activity Created!
          </Typography>
          <Typography id="success-modal-description" sx={{ mb: 3 }}>
            Your new activity has been successfully created.
          </Typography>
          <Button onClick={handleCloseModal} variant="contained" color="primary" sx={{ bgcolor: "#00796b", ":hover": { bgcolor: "#004d40" } }}>
            Go to Homepage
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default AdvertiserAddActivity;