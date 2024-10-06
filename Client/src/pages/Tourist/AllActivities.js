import React, { useState, useEffect } from "react";
import axios from "axios";

const AllActivities = () => {
  const [activities, setActivities] = useState([]); // Store the activities
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch activities from the backend
  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/tourist/activity"
      ); // Adjust the URL as needed
      setActivities(response.data); // Set activities data
      setLoading(false);
    } catch (error) {
      setError("Error fetching activities");
      setLoading(false);
    }
  };

  // useEffect to call fetchActivities when component mounts
  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Upcoming Activities</h2>
      {activities.length === 0 ? (
        <p>No upcoming activities available.</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity._id}>
              <h3>{activity.name}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(activity.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Category:</strong> {activity.category}
              </p>
              <p>
                <strong>Price:</strong> ${activity.price}
              </p>
              <p>
                <strong>Rating:</strong> {activity.rating}
              </p>
              <p>
                <strong>Discount:</strong> {activity.discount}%
              </p>
              <p>
                <strong>Location:</strong> {activity.location.name}
              </p>
              <p>
                <strong>Bookable:</strong> {activity.isBookable ? "Yes" : "No"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllActivities;
