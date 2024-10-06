import React, { useState, useEffect } from "react";
import axios from "axios";

const AllItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch all itineraries on component mount
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/tourist/itinerary"
        ); // Replace with your endpoint
        setItineraries(response.data);
        setResponseMessage("");
      } catch (error) {
        setResponseMessage("Failed to fetch itineraries.");
      }
    };

    fetchItineraries();
  }, []);

  return (
    <div>
      <h2>All Itineraries</h2>
      {responseMessage && <p>{responseMessage}</p>}
      {itineraries.length > 0 ? (
        <ul>
          {itineraries.map((itinerary) => (
            <li key={itinerary._id}>
              <h3>{itinerary.title}</h3>
              <p>Date: {new Date(itinerary.date).toLocaleDateString()}</p>
              <p>Budget: ${itinerary.budget}</p>
              <p>Language: {itinerary.language}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No itineraries available.</p>
      )}
    </div>
  );
};

export default AllItineraries;
