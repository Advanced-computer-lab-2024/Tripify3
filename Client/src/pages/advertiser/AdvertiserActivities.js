import React, { useEffect, useState } from "react";
import { createActivity, deleteActivity, getAllActivitiesByAdvertiser, updateActivity, getAllTags, getAllCategories } from "../../services/advertiser.js";
import { getUserId } from "../../utils/authUtils.js";
import { useNavigate } from "react-router-dom";

const AdvertiserActivities = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newActivity, setNewActivity] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    price: "",
    categoryId: "",
    specialDiscount: "",
    booking: false,
    duration: "",
  });
  const [editingActivityId, setEditingActivityId] = useState(null); // Track the activity being edited

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
      setCategories(response.data.categories);
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
        advertiserId: userId,
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
        categoryId: "",
        specialDiscount: "",
        booking: false,
        duration: "",
      }); // Reset form
      setSelectedTags([]);
    } catch (error) {
      console.error("Failed to add activity:", error);
    }
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
      categoryId: activity.category._id || "",
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
    navigate('/location-selection');
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "2em", marginBottom: "20px" }}>Activities</h1>
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "1.5em" }}>{editingActivityId ? "Edit Activity" : "Add New Activity"}</h2>
        <input style={{ width: "100%", padding: "10px", marginBottom: "10px" }} type="text" name="name" placeholder="Name" value={newActivity.name} onChange={handleInputChange} />
        <input style={{ width: "100%", padding: "10px", marginBottom: "10px" }} type="date" name="date" value={newActivity.date} onChange={handleInputChange} />
        <input style={{ width: "100%", padding: "10px", marginBottom: "10px" }} type="time" name="time" value={newActivity.time} onChange={handleInputChange} />
        <input
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          type="text"
          name="location"
          placeholder="Location"
          value={newActivity.location}
          onClick={handleLocationClick} // Navigate on click
          readOnly // Make it read-only since it opens a new page
        />
        <input style={{ width: "100%", padding: "10px", marginBottom: "10px" }} type="text" name="price" placeholder="Price" value={newActivity.price} onChange={handleInputChange} />

        <label style={{ display: "block", marginBottom: "10px" }}>
          Category:
          <select
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            name="categoryId"
            value={newActivity.categoryId}
            onChange={(e) => setNewActivity({ ...newActivity, categoryId: e.target.value })}
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

export default AdvertiserActivities;
