import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PlacesList() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/governor/getAllPlaces`
      );
      setPlaces(response.data.data.places);
      console.log(response.data.data.places);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Centered Title */}
      <h1 style={{ textAlign: "center", fontSize: "36px", marginBottom: "30px" }}>
        Places List
      </h1>

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
              cursor: "pointer"
            }}
          >
            Add Place
          </button>
        </Link>
      </div>

      {/* List of places */}
      {places.map((place) => (
        <div
          key={place._id}
          style={{
            marginBottom: "20px",
            border: "1px solid #ddd",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
          }}
        >
          <h2 style={{ fontSize: "24px", marginBottom: "10px", color: "#333" }}>
            {place.name}
          </h2>
          <p style={{ fontSize: "16px", marginBottom: "20px", color: "#666" }}>
            {place.description}
          </p>
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
                cursor: "pointer"
              }}
            >
              Edit Place
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default PlacesList;
