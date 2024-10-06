import React, { useState, useEffect } from "react";
import axios from "axios";

const AllHistoricalPlaces = () => {
  const [historicalPlaces, setHistoricalPlaces] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch all historical places on component mount
  useEffect(() => {
    const fetchHistoricalPlaces = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/tourist/historicalPlaces"
        ); // Replace with your endpoint
        setHistoricalPlaces(response.data);
        setResponseMessage("");
      } catch (error) {
        setResponseMessage("Failed to fetch historical places.");
      }
    };

    fetchHistoricalPlaces();
  }, []);

  return (
    <div>
      <h2>All Historical Places</h2>
      {/* Display response message if there's any */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display the list of historical places */}
      {historicalPlaces.length > 0 ? (
        <ul>
          {historicalPlaces.map((place) => (
            <li key={place._id}>
              <h3>{place.name}</h3>
              <p>Location: {place.location}</p>
              <p>Category: {place.category}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No historical places available.</p>
      )}
    </div>
  );
};

export default AllHistoricalPlaces;
