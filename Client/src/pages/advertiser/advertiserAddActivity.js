import React, { useState, useEffect, useRef } from "react";
import { createActivity, deleteActivity, getAllActivitiesByAdvertiser, updateActivity, getAllTags, getAllCategories } from "../../services/advertiser.js";
import { getUserId } from "../../utils/authUtils.js";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Modal, Typography } from "@mui/material";
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
  const [activities, setActivities] = useState([]);
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
    booking: false,
    duration: "",
  });

  const [editingActivityId, setEditingActivityId] = useState(null); // Track the activity being edited
  const mapRef = useRef(null);
  const userId = getUserId();
  const navigate = useNavigate();

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const response = await getAllActivitiesByAdvertiser(userId);
      setActivities(response.data);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  // Fetch tags
  const fetchTags = async () => {
    try {
      const response = await getAllTags();
      setTags(response.data.tags);
    } catch (error) {
      console.error("Failed to fetch tags:", error);
    }
  };

  useEffect(() => {
    fetchActivities();
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
      // Fetch all activities again after adding the new one
      await fetchActivities(); // Now this is accessible
      setNewActivity({
        name: "",
        date: "",
        time: "",
        location: "",
        price: "",
        category: "",
        specialDiscount: "",
        booking: false,
        duration: "",
      }); // Reset form
      setSelectedTags([]);
    } catch (error) {
      console.error("Failed to add activity:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    window.location.href = "../homePage.html"; // Change to your desired action
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteActivity(userId, activityId);
      setActivities(activities.filter((activity) => activity._id !== activityId));
    } catch (error) {
      console.error("Failed to delete activity:", error);
    }
  };

  const handleEditClick = (activity) => {
    setEditingActivityId(activity._id);
    setNewActivity({
      name: activity.name,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      price: activity.price,
      category: activity.category._id || "",
      specialDiscount: activity.specialDiscount,
      booking: activity.booking,
      duration: activity.duration,
    });
    setSelectedTags(activity.tags.map((tag) => tag._id) || []);
  };

  const handleSaveActivity = async () => {
    try {
      await updateActivity(userId, editingActivityId, {
        ...newActivity,
        tags: selectedTags,
        duration: parseInt(newActivity.duration),
      });
      // Refresh the page after saving
      window.location.reload(); // Reload the entire page
    } catch (error) {
      console.error("Failed to update activity:", error);
    }
  };

  const handleLocationClick = () => {
    // Navigate to the location selection page
    navigate("/location-selection");
  };

  useEffect(() => {
    const cairoCoordinates = { lat: 30.0444, lng: 31.2357 }; // Cairo, Egypt
    map = L.map(mapRef.current).setView([cairoCoordinates.lat, cairoCoordinates.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on("click", function (e) {
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker(e.latlng).addTo(map); // Use default marker icon here
      setLocation("Fetching address...");
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  let map;
  let marker;

  const reverseGeocode = (lat, lng) => {
    setLoadingAddress(true);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((response) => response.json())
      .then((data) => {
        setLocation(data.display_name);
        setNewActivity((prevActivity) => ({
          ...prevActivity,
          location: data.display_name, // Update the newActivity with the selected location
        }));
        setClinicArea(data.address.suburb || data.address.village || data.address.town || "");
        setClinicGovernorate(data.address.county || data.address.state || "");
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoadingAddress(false));
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2em", marginBottom: "20px" }}>Activities</h1>
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "1.5em" }}>{editingActivityId ? "Edit Activity" : "Add New Activity"}</h2>
        <input style={{ width: "100%", padding: "10px", marginBottom: "10px" }} type="text" name="name" placeholder="Name" value={newActivity.name} onChange={handleInputChange} />
        <input
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          type="date"
          name="date"
          value={newActivity.date}
          min={new Date().toISOString().split("T")[0]}
          onChange={handleInputChange}
        />
        <input style={{ width: "100%", padding: "10px", marginBottom: "10px" }} type="time" name="time" value={newActivity.time} onChange={handleInputChange} />

        <Box className="container3" sx={{ mt: 10, px: 5, pb: 10 }}>
          <Typography variant="h4" gutterBottom>
            Pin your activity's location on the map
          </Typography>
          <Box
            ref={mapRef}
            sx={{
              height: 500,
              width: "100%",
              mb: 2,
              bgcolor: "#e0e0e0",
            }}
          />

          <form id="doctorForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <TextField
                fullWidth
                label="Address"
                value={location} // Bound to the location state
                onChange={(e) => {
                  setLocation(e.target.value); // Update location state
                  setNewActivity({ ...newActivity, location: e.target.value }); // Update newActivity.location
                }}
                required
                sx={{ mb: 2 }}
              />
            </div>
          </form>

          {/* <form id="doctorForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <TextField fullWidth label="Address" value={location} onChange={(e) => setLocation(e.target.value)} required sx={{ mb: 2 }} />
            </div>
          </form> */}
        </Box>
        {/* <input
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          type="text"
          name="location"
          placeholder="Location"
          value={newActivity.location}
        /> */}
        <input style={{ width: "100%", padding: "10px", marginBottom: "10px" }} type="text" name="price" placeholder="Price" value={newActivity.price} onChange={handleInputChange} />

        <label style={{ display: "block", marginBottom: "10px" }}>
          Category:
          <select
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            name="category"
            value={newActivity.category}
            onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div style={{ marginBottom: "20px" }}>
          Tags:
          {tags.map((tag) => (
            <label key={tag._id} style={{ display: "block" }}>
              <input type="checkbox" checked={selectedTags.includes(tag._id)} onChange={() => handleTagChange(tag._id)} />
              {tag.name}
            </label>
          ))}
        </div>

        <input
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          type="text"
          name="specialDiscount"
          placeholder="Special Discount"
          value={newActivity.specialDiscount}
          onChange={handleInputChange}
        />
        <input
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={newActivity.duration}
          onChange={handleInputChange}
        />

        <label style={{ display: "block", marginBottom: "10px" }}>
          Booking Open:
          <input type="checkbox" name="booking" checked={newActivity.booking} onChange={(e) => setNewActivity({ ...newActivity, booking: e.target.checked })} />
        </label>
        <button
          style={{ padding: "10px 20px", fontSize: "1em", backgroundColor: "#00695C", color: "white", border: "none", cursor: "pointer" }}
          onClick={editingActivityId ? handleSaveActivity : handleAddActivity}
        >
          {editingActivityId ? "Save Activity" : "Add Activity"}
        </button>
      </div>

      <h2 style={{ fontSize: "1.5em" }}>Your Activities</h2>
      <ul style={{ listStyleType: "none", padding: "0" }}>
        {activities.map((activity) => (
          <li key={activity._id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
            <h3>{activity.name}</h3>
            <p>Date: {activity.date}</p>
            <p>Time: {activity.time}</p>
            <p>Location: {activity.location}</p>
            <p>Price: {activity.price}</p>
            <p>Category: {activity.category.name}</p>
            <p>Tags: {activity.tags.map((tag) => tag.name).join(", ")}</p>
            <p>Special Discount: {activity.specialDiscount}</p>
            <p>Duration: {activity.duration} minutes</p>
            <label>
              <strong>Booking Open:</strong> {activity.booking ? "Yes" : "No"}
            </label>
            <div>
              <button style={{ padding: "5px 10px", marginRight: "5px", backgroundColor: "blue", color: "white" }} onClick={() => handleEditClick(activity)}>
                Edit
              </button>
              <button style={{ padding: "5px 10px", backgroundColor: "red", color: "white" }} onClick={() => handleDeleteActivity(activity._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdvertiserAddActivity;