import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Replace with your actual API URL

const FollowedTourGuides = ({ touristId }) => {
  const [tourGuides, setTourGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTourGuides(touristId); // Fetch tour guides with the provided touristId
  }, [touristId]);

  const fetchTourGuides = async (touristId) => {
    setLoading(true); // Start loading before making the request
    setMessage(""); // Reset message before fetching

    try {
      const response = await axios.get(`${API_URL}/tourists/${touristId}/following`);
      setTourGuides(response.data);

      if (response.data.length === 0) {
        setMessage("No tour guides followed yet."); // Set message if no guides are found
      } else {
        setMessage(""); // Clear message if there are tour guides
      }
    } catch (err) {
      console.error(err); // Log error for debugging
      setError("Failed to load followed tour guides"); // Set error state on failure
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="followed-tour-guides-container">
      <h2>Followed Tour Guides</h2>
      {message && <p className="info-message">{message}</p>}
      {tourGuides.length === 0 ? (
        <p>No tour guides followed yet.</p>
      ) : (
        <ul className="tour-guides-list">
          {tourGuides.map((guide) => (
            <li key={guide._id} className="tour-guide-item">
              <h3>{guide.name}</h3>
              <p>{guide.bio}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Styles go here if you want to keep the same structure as before */}
    </div>
  );
};

export default FollowedTourGuides;