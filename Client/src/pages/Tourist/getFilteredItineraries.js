import React, { useState, useEffect } from "react";
import axios from "axios";

const FilteredItineraries = () => {
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [preferences, setPreferences] = useState("");
  const [language, setLanguage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch filtered itineraries based on user inputs
  const fetchFilteredItineraries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/tourist/itinerary/filter",
        {
          params: { budget, date, preferences, language },
        }
      ); // Replace with your endpoint
      setFilteredItineraries(response.data);
      setResponseMessage("");
    } catch (error) {
      setResponseMessage("Failed to fetch filtered itineraries.");
    }
  };

  // Handle form submission for filtering
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchFilteredItineraries();
  };

  return (
    <div>
      <h2>Filter Itineraries</h2>
      <form onSubmit={handleFilterSubmit}>
        <div>
          <label>Budget:</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Enter max budget"
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label>Preferences:</label>
          <input
            type="text"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Enter comma-separated preferences"
          />
        </div>
        <div>
          <label>Language:</label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Enter language"
          />
        </div>
        <button type="submit">Filter Itineraries</button>
      </form>

      {responseMessage && <p>{responseMessage}</p>}
      {filteredItineraries.length > 0 ? (
        <ul>
          {filteredItineraries.map((itinerary) => (
            <li key={itinerary._id}>
              <h3>{itinerary.title}</h3>
              <p>Date: {new Date(itinerary.date).toLocaleDateString()}</p>
              <p>Budget: ${itinerary.budget}</p>
              <p>Language: {itinerary.language}</p>
              <p>Preferences: {itinerary.preferences.join(", ")}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No itineraries available.</p>
      )}
    </div>
  );
};

export default FilteredItineraries;
