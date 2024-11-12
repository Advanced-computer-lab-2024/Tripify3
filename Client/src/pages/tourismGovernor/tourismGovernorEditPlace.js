import React, { useState, useEffect, useRef } from "react";
import { getPlaceDetails, updatePlace } from "../../services/tourismGovernor.js";

import { getAllCategories, getAllTags } from "../../services/advertiser.js";
import { createPlace } from "../../services/tourismGovernor.js";
import { getUserId } from "../../utils/authUtils.js";
import { useParams, useNavigate } from "react-router-dom";
import { Box, TextField, FormControl, Button, Modal, Typography, FormGroup, Select, MenuItem, InputLabel, CircularProgress, Grid } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const TourismGovernorEditPlace = () => {
  const { id } = useParams();
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [placeData, setPlaceData] = useState({
    name: "",
    location: "",
    ticketPrices: { foreigner: "", native: "", student: "" },
    description: "",
    type: "",
    openingDays: [],
    openingHours: { from: "", to: "" },
    tags: [],
  });
  const [selectedDays, setSelectedDays] = useState([]);
  const mapRef = useRef(null);
  const userId = getUserId();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const response = await getPlaceDetails(id);
        const place = response.data.data.place;
        console.log(place);

        setPlaceData({
          name: place.name,
          location: place.location,
          ticketPrices: place.ticketPrices,
          description: place.description,
          type: place.type,
          openingDays: place.openingDays,
          openingHours: place.openingHours[0],
          tags: place.tags.map((tag) => tag._id),
        });
        setSelectedTags(place.tags.map((tag) => tag._id));
        setSelectedDays(place.openingDays);
      } catch (error) {
        setErrorMessage("Failed to load place details.");
      }
    };

    const fetchCategoriesAndTags = async () => {
      const [categoriesResponse, tagsResponse] = await Promise.all([getAllCategories(), getAllTags()]);
      setCategories(categoriesResponse.data);
      setTags(tagsResponse.data.tags);
    };

    fetchPlaceData();
    fetchCategoriesAndTags();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlaceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagChange = (tagId) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]));
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prevDays) => (prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updateData = {
        ...placeData,
        tags: selectedTags,
        openingDays: selectedDays,
      };
      await updatePlace(id, updateData);
      setOpenModal(true);
      setTimeout(() => {
        setOpenModal(false);
        navigate(`/historical-places/${id}`);
      }, 2000);
    } catch (error) {
      setErrorMessage("Failed to update place.");
    }
  };

  useEffect(() => {
    const cairoCoordinates = { lat: 30.0444, lng: 31.2357 };
    const map = L.map(mapRef.current).setView([cairoCoordinates.lat, cairoCoordinates.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    let marker;
    map.on("click", function (e) {
      if (marker) map.removeLayer(marker);
      marker = L.marker(e.latlng).addTo(map);
      setLocation("Fetching address...");
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      map.remove();
    };
  }, []);

  const reverseGeocode = (lat, lng) => {
    setLoadingAddress(true);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((response) => response.json())
      .then((data) => {
        setLocation(data.display_name);
        setPlaceData((prev) => ({ ...prev, location: data.display_name }));
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoadingAddress(false));
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2.5em", marginBottom: "30px", textAlign: "center", fontWeight: "bold" }}>Edit Place</h1>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Place Name" name="name" value={placeData.name} disabled sx={{ mb: 2 }} />

        <TextField fullWidth label="Place Description" name="description" value={placeData.description} onChange={handleInputChange} sx={{ mb: 2 }} multiline rows={4} required />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Place Type</InputLabel>
          <Select name="type" value={placeData.type} onChange={handleInputChange} label="Place Type" required>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
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
          value={placeData.openingHours.from}
          onChange={(e) => setPlaceData((prev) => ({ ...prev, openingHours: { ...prev.openingHours, from: e.target.value } }))}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Opening Hours To"
          type="time"
          value={placeData.openingHours.to}
          onChange={(e) => setPlaceData((prev) => ({ ...prev, openingHours: { ...prev.openingHours, to: e.target.value } }))}
          required
          sx={{ mb: 2 }}
        />

        {/* Ticket Prices */}
        <TextField
          fullWidth
          label="Ticket Price for Foreigners"
          name="foreigner"
          type="number"
          inputProps={{ min: 0 }}
          value={placeData.ticketPrices.foreigner}
          onChange={(e) => setPlaceData((prev) => ({ ...prev, ticketPrices: { ...prev.ticketPrices, foreigner: e.target.value } }))}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Ticket Price for Natives"
          name="native"
          type="number"
          inputProps={{ min: 0 }}
          value={placeData.ticketPrices.native}
          onChange={(e) => setPlaceData((prev) => ({ ...prev, ticketPrices: { ...prev.ticketPrices, native: e.target.value } }))}
          sx={{ mb: 2 }}
          required
        />
        <TextField
          fullWidth
          label="Ticket Price for Students"
          name="student"
          type="number"
          inputProps={{ min: 0 }}
          value={placeData.ticketPrices.student}
          onChange={(e) => setPlaceData((prev) => ({ ...prev, ticketPrices: { ...prev.ticketPrices, student: e.target.value } }))}
          sx={{ mb: 2 }}
          required
        />

        {/* Tags Selection */}
        <Typography variant="h6">Select Tags</Typography>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {tags.map((tag) => (
            <Grid item key={tag._id}>
              <Button
                variant="contained"
                onClick={() => handleTagChange(tag._id)}
                sx={{
                  bgcolor: selectedTags.includes(tag._id) ? "blue" : "gray",
                  color: "white",
                  ":hover": { bgcolor: selectedTags.includes(tag._id) ? "darkblue" : "darkgray" },
                }}
              >
                {tag.name}
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Location on Map */}
        <Box ref={mapRef} style={{ height: "400px", width: "100%", marginBottom: "20px" }}></Box>

        {loadingAddress && <CircularProgress />}
        <TextField fullWidth label="Selected Location" value={placeData.location} sx={{ mb: 2 }} disabled />

        {/* <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={handleLocationClick}>
          Edit Location
        </Button> */}

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
          Update Place
        </Button>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: 24,
              maxWidth: 400,
              margin: "auto",
              mt: "20vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
              Place Updated Successfully!
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
              You will be redirected to the place details page shortly.
            </Typography>
            <CircularProgress color="primary" />
          </Box>
        </Modal>
      </form>
    </div>
  );
};

export default TourismGovernorEditPlace;
