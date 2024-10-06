import React, { useEffect, useState } from "react";
import { createActivity, deleteActivity, getAllActivitiesByAdvertiser, updateActivity, getAllTags, getAllCategories } from "../../services/advertiser.js"; // Adjust the import path as necessary
import { getUserId } from "../../utils/authUtils.js";

const AdvertiserActivities = () => {
  const [activities, setActivities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newActivity, setNewActivity] = useState({ 
    name: '', 
    date: '', 
    time: '', 
    location: '', 
    price: '', 
    category: '', 
    specialDiscount: '', 
    booking: false,
    duration: '' // Add duration to the state
  });
  
  const userId = getUserId();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getAllActivitiesByAdvertiser(userId);
        setActivities(response.data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.categories); // Assuming response format
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await getAllTags();
        setTags(response.data.tags); // Assuming response format
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

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
        return prev.filter(id => id !== tagId); // Remove tag if already selected
      } else {
        return [...prev, tagId]; // Add new tag
      }
    });
  };

  const handleAddActivity = async () => {
    try {
      const response = await createActivity({ 
        ...newActivity, 
        advertiserId: userId, 
        tags: selectedTags,
        duration: parseInt(newActivity.duration) // Ensure duration is sent as an integer
      });
      setActivities([...activities, response.data.activity]);
      setNewActivity({ name: '', date: '', time: '', location: '', price: '', category: '', specialDiscount: '', booking: false, duration: '' }); // Reset duration
      setSelectedTags([]); // Reset selected tags
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

  const handleUpdateActivity = async (activityId) => {
    try {
      const response = await updateActivity(userId, activityId, newActivity);
      setActivities(activities.map((activity) => (activity._id === activityId ? response.data.activity : activity)));
    } catch (error) {
      console.error("Failed to update activity:", error);
    }
  };

  return (
    <div>
      <h1>Activities</h1>
      <div>
        <h2>Add New Activity</h2>
        <input type="text" name="name" placeholder="Name" value={newActivity.name} onChange={handleInputChange} />
        <input type="date" name="date" value={newActivity.date} onChange={handleInputChange} />
        <input type="time" name="time" value={newActivity.time} onChange={handleInputChange} />
        <input type="text" name="location" placeholder="Location" value={newActivity.location} onChange={handleInputChange} />
        <input type="text" name="price" placeholder="Price" value={newActivity.price} onChange={handleInputChange} />
        
        <label>
          Category:
          <select 
            name="category" 
            value={newActivity.category} 
            onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}>
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </label>

        <div>
          Tags:
          {tags.map(tag => (
            <label key={tag._id}>
              <input 
                type="checkbox" 
                checked={selectedTags.includes(tag._id)} 
                onChange={() => handleTagChange(tag._id)} 
              />
              {tag.name}
            </label>
          ))}
        </div>

        <input type="text" name="specialDiscount" placeholder="Special Discount" value={newActivity.specialDiscount} onChange={handleInputChange} />
        <input type="number" name="duration" placeholder="Duration (minutes)" value={newActivity.duration} onChange={handleInputChange} />
        
        <label>
          Booking Open:
          <input type="checkbox" name="booking" checked={newActivity.booking} onChange={(e) => setNewActivity({ ...newActivity, booking: e.target.checked })} />
        </label>
        <button onClick={handleAddActivity}>Add Activity</button>
      </div>
      
      <h2>Your Activities</h2>
      <ul>
        {activities.map(activity => (
          <li key={activity._id}>
            <strong>{activity.name}</strong><br />
            Date: {activity.date} <br />
            Time: {activity.time} <br />
            Location: {activity.location} <br />
            Price: ${activity.price.toFixed(2)} <br />
            Duration: {activity.duration} minutes <br />
            Special Discount: {activity.specialDiscount}% <br />
            Booking Open: {activity.isBooking ? "Yes" : "No"} <br />
            <button onClick={() => handleUpdateActivity(activity._id)}>Edit</button>
            <button onClick={() => handleDeleteActivity(activity._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdvertiserActivities;
