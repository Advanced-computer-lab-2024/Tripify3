// src/pages/advertiser/Activities.js

import React, { useEffect, useState } from "react";
import { createActivity, deleteActivity, getAllActivitiesByAdvertiser, updateActivity } from "../../services/advertiser.js"; // Adjust the import path as necessary
import { getUserId } from "../../utils/authUtils.js";


const AdvertiserActivities = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({ name: '', date: '', time: '', location: '', price: '', category: '', tags: '', specialDiscount: '', booking: false });
  const userId = getUserId();

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await getAllActivitiesByAdvertiser(userId);
      setActivities(response.data);
    };

    fetchActivities();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddActivity = async () => {
    const response = await createActivity({ ...newActivity, id: userId });
    setActivities([...activities, response.data.activity]);
    setNewActivity({ name: '', date: '', time: '', location: '', price: '', category: '', tags: '', specialDiscount: '', booking: false });
  };

  const handleDeleteActivity = async (activityId) => {
    await deleteActivity(userId, activityId);
    setActivities(activities.filter((activity) => activity._id !== activityId));
  };

  const handleUpdateActivity = async (activityId) => {
    const response = await updateActivity(userId, activityId, newActivity);
    setActivities(activities.map((activity) => (activity._id === activityId ? response.data.activity : activity)));
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
        <input type="text" name="category" placeholder="Category" value={newActivity.category} onChange={handleInputChange} />
        <input type="text" name="tags" placeholder="Tags" value={newActivity.tags} onChange={handleInputChange} />
        <input type="text" name="specialDiscount" placeholder="Special Discount" value={newActivity.specialDiscount} onChange={handleInputChange} />
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
            {activity.name} - {activity.date} - {activity.time} - {activity.location}
            <button onClick={() => handleUpdateActivity(activity._id)}>Edit</button>
            <button onClick={() => handleDeleteActivity(activity._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdvertiserActivities;
