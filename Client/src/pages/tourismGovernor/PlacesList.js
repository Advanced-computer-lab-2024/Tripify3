import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getUserId } from "../../utils/authUtils.js";

function PlacesList() {
  const [places, setPlaces] = useState([]);
  const [tagName, setTagName] = useState("");
  const [message, setMessage] = useState(""); // State for messages
  const [messageType, setMessageType] = useState(""); // State for message type (success or error)
  const userId = getUserId();

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/governor/${userId}`);
      setPlaces(response.data.data.places);
      console.log(response.data.data.places);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const deletePlace = async (placeId) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        await axios.delete(`http://localhost:8000/governor/${placeId}`);
        fetchPlaces(); // Fetch updated places list after deletion
      } catch (error) {
        console.error("Error deleting place:", error);
      }
    }
  };

  const handleTagInputChange = (e) => {
    setTagName(e.target.value);
    setMessage(""); // Clear previous message on input change
  };

  const handleTagSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/governor/createTag", {
        name: tagName,
      });
      
      if (response.status === 201) {
        setMessage("Tag created successfully!");
        setMessageType("success"); // Set message type for styling
        setTagName(""); // Clear the input field after creation
      } else if (response.status === 400) {
        setMessage("This tag already exists.");
        setMessageType("error"); // Set message type for styling
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      setMessage("This tag already exists.");
      setMessageType("error"); // Set message type for styling
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", fontSize: "36px", marginBottom: "30px" }}>Places List</h1>

      {/* Add Place button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <Link to="/governor/addPlace">
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add Place
          </button>
        </Link>
      </div>

      {/* Create Tag Form */}
      <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>Create Tag</h2>
      <form onSubmit={handleTagSubmit} style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <input
          type="text"
          placeholder="Tag Name"
          value={tagName}
          onChange={handleTagInputChange}
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            marginRight: "10px",
            width: "300px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Create Tag
        </button>
      </form>

      {/* Message Display */}
      {message && (
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "5px",
            color: messageType === "success" ? "#155724" : "#721c24",
            backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
            border: messageType === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      {/* List of places */}
      {places.map((place) => (
        <div
          key={place._id}
          style={{
            marginBottom: "20px",
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "10px", color: "#333" }}>{place.name}</h2>
          <p style={{ fontSize: "16px", marginBottom: "20px", color: "#666" }}>{place.description}</p>
          <Link to={`/governor/${place._id}`} style={{ marginRight: "15px", color: "#007BFF" }}>
            View Details
          </Link>
          <Link to={`/governor/edit/${place._id}`}>
            <button
              style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Edit Place
            </button>
          </Link>
          <button
            onClick={() => deletePlace(place._id)} // Call delete function with place ID
            style={{
              marginTop: "10px",
              padding: "8px 16px",
              backgroundColor: "#dc3545", // Red background for delete button
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginLeft: "10px", // Space between buttons
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default PlacesList;
