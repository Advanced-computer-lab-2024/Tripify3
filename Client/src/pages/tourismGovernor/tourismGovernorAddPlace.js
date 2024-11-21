import React, { useState, useEffect, useRef } from "react";
import { getAllCategories, getAllTags } from "../../services/advertiser.js";
import { createPlace } from "../../services/tourismGovernor.js";
import { getUserId } from "../../utils/authUtils.js";
import { useNavigate } from "react-router-dom";
import { Box, TextField,FormControl, Button, Modal, Typography, FormGroup, Select, MenuItem, InputLabel, CircularProgress, Grid } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const TourismGovernorAddPlace = () => {
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [newActivity, setNewActivity] = useState({
    name: "",
    location: "",
    foreignerPrice: "",
    nativePrice: "",
    studentPrice: "",
    description: "",
    placeType: "",
    openingDays: [],
    openingHours: { from: "", to: "" },
  });

  const [selectedDays, setSelectedDays] = useState([]);
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
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prevDays) => (prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]));
  };

  const handleAddActivity = async () => {
    // Check required fields
    if (
      !newActivity.description ||
      !newActivity.name ||
      !newActivity.location ||
      !newActivity.foreignerPrice ||
      !newActivity.nativePrice ||
      !newActivity.studentPrice ||
      !selectedDays.length ||
      !newActivity.placeType ||
      !newActivity.openingHours.from ||
      !newActivity.openingHours.to
    ) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    // Check time validity
    if (newActivity.openingHours.from >= newActivity.openingHours.to) {
      setErrorMessage("Opening start time must be before end time.");
      return;
    }

    try {
      // Construct the new request body
      const requestBody = {
        name: newActivity.name,
        description: newActivity.description,
        location: newActivity.location,
        type: newActivity.placeType,
        openingDays: selectedDays,
        openingHours: {
          from: newActivity.openingHours.from,
          to: newActivity.openingHours.to,
        },
        tourismGovernor: userId,
        tags: selectedTags,
        ticketPrices: {
          foreigner: parseFloat(newActivity.foreignerPrice),
          native: parseFloat(newActivity.nativePrice),
          student: parseFloat(newActivity.studentPrice),
        },
      };

      await createPlace(requestBody);
      setOpenModal(true); // Open the modal after successful place creation
      setErrorMessage("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("Place name already exists. Please choose a different name.");
      } else {
        console.error("Failed to add activity:", error);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddActivity(); // Call handleAddActivity on form submission
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate("/tourism-governor/historical-places");
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
        <TextField fullWidth label="Place Name" name="name" value={newActivity.name} onChange={handleInputChange} sx={{ mb: 2 }} required />

        <TextField
          fullWidth
          label="Place Description"
          name="description"
          value={newActivity.description}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          multiline
          rows={4} // Optional: add rows to make it a larger text area
          required
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Place Type</InputLabel>
          <Select name="placeType" value={newActivity.placeType} onChange={handleInputChange} label="Place Type" required>
            <MenuItem value="Monument">Monument</MenuItem>
            <MenuItem value="Religious Site">Religious Site</MenuItem>
            <MenuItem value="Palace">Palace</MenuItem>
            <MenuItem value="Historical Place">Historical Place</MenuItem>
            <MenuItem value="Museum">Museum</MenuItem>
          </Select>
        </FormControl>

        {/* Opening Days Selection */}
        <FormGroup sx={{ mb: 2 }}>
          <Typography variant="h6">Opening Days</Typography>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <Button
              key={day}
              variant="contained"
              onClick={() => handleDayToggle(day)}
              sx={{
                mb: 1,
                bgcolor: selectedDays.includes(day) ? "green" : "gray",
                color: "white",
                ":hover": { bgcolor: selectedDays.includes(day) ? "darkgreen" : "darkgray" },
              }}
            >
              {day}
            </Button>
          ))}
        </FormGroup>

        {/* Opening Hours */}
        <TextField
          fullWidth
          label="Opening Hours From"
          type="time"
          value={newActivity.openingHours.from}
          onChange={(e) => setNewActivity((prev) => ({ ...prev, openingHours: { ...prev.openingHours, from: e.target.value } }))}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Opening Hours To"
          type="time"
          value={newActivity.openingHours.to}
          onChange={(e) => setNewActivity((prev) => ({ ...prev, openingHours: { ...prev.openingHours, to: e.target.value } }))}
          required
          sx={{ mb: 2 }}
        />

        {/* Ticket Prices */}
        <TextField
          fullWidth
          label="Ticket Price for Foreigners"
          name="foreignerPrice"
          type="number"
          inputProps={{ min: 0 }}
          value={newActivity.foreignerPrice}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Ticket Price for Natives"
          name="nativePrice"
          type="number"
          inputProps={{ min: 0 }}
          value={newActivity.nativePrice}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Ticket Price for Students"
          name="studentPrice"
          type="number"
          inputProps={{ min: 0 }}
          value={newActivity.studentPrice}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
        />
        {/* Tags Section: Limit to 3 tags per row */}
        <FormGroup sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Tags
          </Typography>
          <Grid container spacing={1} columns={{ xs: 4, sm: 6, md: 12 }}>
            {tags.map((tag) => (
              <Grid item xs={4} sm={4} md={4} key={tag._id}>
                {" "}
                {/* 3 tags per row */}
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

        {/* Location on Map */}
        <Box ref={mapRef} style={{ height: "400px", width: "100%", marginBottom: "20px" }}></Box>
       
        {loadingAddress && <CircularProgress />}
        <TextField fullWidth label="Selected Location" value={location} sx={{ mb: 2 }} disabled />

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ py: 1.5 }}>
          Add Place
        </Button>
      </form>

      {/* Success Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "white", p: 4, borderRadius: 1 }}>
          <Typography variant="h6">Place Added Successfully</Typography>
          <Button onClick={handleCloseModal} variant="contained" sx={{ mt: 2 }}>
            Go to view All Places
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default TourismGovernorAddPlace;
