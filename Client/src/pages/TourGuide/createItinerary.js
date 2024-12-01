import React, { useState, useEffect, useRef } from "react";
import { getAllTags } from "../../services/advertiser.js";
import { getAllPlaces } from "../../services/tourGuide.js";
import {  getAllActivitiesForTourist } from "../../services/tourist.js";
import { createItinerary } from "../../services/tourGuide.js";
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

const TourGuideCreateItinerary = () => {
  const [tags, setTags] = useState([]);
  const [places, setPlaces] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const languages = ["English", "Spanish", "French", "German", "Arabic", "Russian", "Japanese", "Korean", "Italian"];

  const [availableDates, setAvailableDates] = useState([]); // New state for multiple dates

  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [newItinerary, setnewItinerary] = useState({
    name: "",
    language: "",
    pickupLocation: "",
    dropoffLocation: "",
    startTime: "",
    endTime: "",
    date: "",
    time: "",
    price: "",
    accessibility: "",
  });

  const mapRef = useRef(null);
  const userId = getUserId();
  const navigate = useNavigate();

  const fetchTags = async () => {
    try {
      const response = await getAllTags();
      setTags(response.data.tags);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };
  const fetchActivities = async () => {
    try {
      const response = await getAllActivitiesForTourist(userId);
      setActivities(response.data.activities);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  const fetchPlaces = async () => {
    try {
      const response = await getAllPlaces();
      setPlaces(response.data.places);
    } catch (error) {
      console.error("Failed to fetch places:", error);
    }
  };

  useEffect(() => {
    fetchTags();
    fetchActivities();
    fetchPlaces();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setnewItinerary((prev) => ({ ...prev, [name]: value }));
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
  const handleActivityChange = (activityId) => {
    setSelectedActivities((prev) => {
      if (prev.includes(activityId)) {
        return prev.filter((id) => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };

  const handlePlaceChange = (placeId) => {
    setSelectedPlaces((prev) => {
      if (prev.includes(placeId)) {
        return prev.filter((id) => id !== placeId);
      } else {
        return [...prev, placeId];
      }
    });
  };

  const handleAddAvailableDate = () => {
    setAvailableDates((prevDates) => [...prevDates, ""]); // Add an empty date input field
  };

  const handleDateChange = (index, value) => {
    const newDates = [...availableDates];
    newDates[index] = value;
    setAvailableDates(newDates);
  };

  const handleAddItinerary = async () => {
    if (availableDates.length === 0) {
      alert("Please add at least one Available date");
      return;
    }
    if (selectedActivities.length === 0) {
      alert("Please add at least one activity");
      return;
    }
    if (selectedPlaces.length === 0) {
      alert("Please add at least one place");
      return;
    }
    if (selectedTags.length === 0) {
      alert("Please add at least one tag");
      return;
    }

    try {
      console.log("==============================");
      console.log(selectedTags);
      
      await createItinerary({
        ...newItinerary,
        tourGuide: userId,
        timeline: { startTime: new Date(newItinerary.startTime), endTime: new Date(newItinerary.endTime) },
        tags: selectedTags,
        activities: selectedActivities,
        places: selectedPlaces,
        availableDates: availableDates,
      });
      setnewItinerary({
        name: "",
        language: "",
        pickupLocation: "",
        dropoffLocation: "",
        startTime: "",
        endTime: "",
        date: "",
        time: "",
        places: "",
        price: "",
        accessibility: "",
      });
      setSelectedTags([]);
      setSelectedActivities([]);
      setSelectedPlaces([]);
      setAvailableDates([]); // Clear the available dates after submission
    } catch (error) {
      console.error("Failed to add Itinerary:", error);
    }
  };

  const handleSubmit = (event) => {
    handleAddItinerary();
    event.preventDefault();
  };

  const handleLocationClick = () => {
    navigate("/location-selection");
  };

  useEffect(() => {}, []);

  let map;
  let marker;

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2.5em", marginBottom: "30px", textAlign: "center", fontWeight: "bold" }}>Add New Itinerary</h1>
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Itinerary Name" name="name" value={newItinerary.name} onChange={handleInputChange} sx={{ mb: 2 }} required />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select name="language" value={newItinerary.language} onChange={(e) => setnewItinerary({ ...newItinerary, language: e.target.value })} required>
            <MenuItem value="">Select a language</MenuItem>
            {languages.map((language) => (
              <MenuItem key={language} value={language}>
                {language}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField fullWidth label="pickupLocation" name="pickupLocation" value={newItinerary.pickupLocation} onChange={handleInputChange} sx={{ mb: 2 }} required />
        <TextField fullWidth label="dropoffLocation" name="dropoffLocation" value={newItinerary.dropoffLocation} onChange={handleInputChange} sx={{ mb: 2 }} required />

        <div>Start Time</div>
        <TextField
          fullWidth
          type="datetime-local"
          name="startTime"
          value={newItinerary.startTime}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
          InputProps={{
            inputProps: {
              min: new Date().toISOString().split("T")[0] + "T" + new Date().toISOString().split("T")[1].slice(0, 5), // Set minimum date and time as the current date and time
            },
          }}
        />

        <div>End Time</div>
        <TextField
          fullWidth
          type="datetime-local"
          name="endTime"
          value={newItinerary.endTime}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
          required
          InputProps={{
            inputProps: {
              min: new Date().toISOString().split("T")[0] + "T" + new Date().toISOString().split("T")[1].slice(0, 5), // Set minimum date and time as the current date and time
            },
          }}
        />

        <TextField fullWidth label="Price" name="price" value={newItinerary.price} onChange={handleInputChange} type="number" inputProps={{ min: 1 }} sx={{ mb: 2 }} required />

        {/* Single Special accessibility Field */}
        <TextField fullWidth label="accessibility" name="accessibility" value={newItinerary.accessibility} onChange={handleInputChange} sx={{ mb: 2 }} />

        {/* Available Dates */}
        <div>
          <Button variant="outlined" onClick={handleAddAvailableDate} sx={{ mb: 2 }}>
            Add Available Date
          </Button>
          {availableDates.map((date, index) => (
            <TextField key={index} value={date} onChange={(e) => handleDateChange(index, e.target.value)} sx={{ mb: 2 }} type="datetime-local" required />
          ))}
        </div>

        {/* activities Section: Limit to 3 activities per row */}
        <FormGroup sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Activity
          </Typography>
          <Grid container spacing={1} columns={{ xs: 4, sm: 6, md: 12 }}>
            {activities.map((activity) => (
              <Grid item xs={4} sm={4} md={4} key={activity._id}>
                {" "}
                {/* 3 activity per row */}
                <Button
                  variant="contained"
                  onClick={() => handleActivityChange(activity._id)}
                  sx={{
                    width: "100%",
                    bgcolor: selectedActivities.includes(activity._id) ? "green" : "gray",
                    color: "white",
                    ":hover": { bgcolor: selectedActivities.includes(activity._id) ? "darkgreen" : "darkgray" },
                  }}
                >
                  {activity.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </FormGroup>

        <FormGroup sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Places
          </Typography>
          <Grid container spacing={1} columns={{ xs: 4, sm: 6, md: 12 }}>
            {places.map((place) => (
              <Grid item xs={4} sm={4} md={4} key={place._id}>
                {" "}
                {/* 3 places per row */}
                <Button
                  variant="contained"
                  onClick={() => handlePlaceChange(place._id)}
                  sx={{
                    width: "100%",
                    bgcolor: selectedPlaces.includes(place._id) ? "green" : "gray",
                    color: "white",
                    ":hover": { bgcolor: selectedPlaces.includes(place._id) ? "darkgreen" : "darkgray" },
                  }}
                >
                  {place.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </FormGroup>

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

        <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mb: 3, bgcolor: "#00796b", ":hover": { bgcolor: "#004d40" } }}>
          Submit Itinerary
        </Button>
      </form>
    </div>
  );
};

export default TourGuideCreateItinerary;
