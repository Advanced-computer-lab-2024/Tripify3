import React, { useState, useEffect } from "react";
import { getAllActivities } from "../../services/tourist.js"; // Import the API function

const AllActivities = () => {
  const [activities, setActivities] = useState([]); // Store the activities
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch activities from the backend
  const fetchActivities = async () => {
    try {
      const response = await getAllActivities();
      setActivities(response.data.activities); // Set activities data
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
    return <p style={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Upcoming Activities</h2>
      {activities.length === 0 ? (
        <p style={styles.noActivities}>No upcoming activities available.</p>
      ) : (
        <div style={styles.grid}>
          {activities.map((activity) => (
            <div key={activity._id} style={styles.card}>
              <h3 style={styles.cardHeading}>{activity.name}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(activity.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {activity.time}
              </p>
              <p>
                <strong>Category:</strong> {activity.categoryId}
              </p>
              <p>
                <strong>Price:</strong> ${activity.price}
              </p>
              <p>
                <strong>Duration:</strong> {activity.duration} mins
              </p>
              <p>
                <strong>Rating:</strong> {activity.rating || "No ratings yet"}
              </p>
              <p>
                <strong>Discount:</strong> {activity.specialDiscount}%
              </p>
              <p>
                <strong>Location:</strong> {activity.location}
              </p>
              <p>
                <strong>Bookable:</strong> {activity.isBooking ? "Yes" : "No"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Styles as JavaScript objects
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#00695c",
  },
  loading: {
    fontSize: "18px",
    textAlign: "center",
    margin: "20px 0",
  },
  error: {
    fontSize: "18px",
    color: "red",
    textAlign: "center",
    margin: "20px 0",
  },
  noActivities: {
    fontSize: "18px",
    textAlign: "center",
    margin: "20px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s",
  },
  cardHeading: {
    fontSize: "20px",
    color: "#333",
    marginBottom: "10px",
  },
  cardHover: {
    transform: "translateY(-5px)",
  },
};

export default AllActivities;
