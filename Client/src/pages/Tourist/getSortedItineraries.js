import React, { useState, useEffect } from "react";
import axios from "axios";

const SortedItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Default is ascending
  const [responseMessage, setResponseMessage] = useState("");

  const fetchSortedItineraries = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/activity/itinerary/sorted",
        {
          params: { sortBy, sortOrder },
        }
      ); // Replace with your endpoint
      setItineraries(response.data);
      setResponseMessage("");
    } catch (error) {
      setResponseMessage("Failed to fetch sorted itineraries.");
    }
  };

  // Handle form submission for sorting
  const handleSortSubmit = (e) => {
    e.preventDefault();
    fetchSortedItineraries();
  };

  return (
    <div>
      <h2>Sort Itineraries</h2>
      <form onSubmit={handleSortSubmit}>
        <div>
          <label>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="date">Date</option>
            <option value="budget">Budget</option>
            <option value="language">Language</option>
          </select>
        </div>
        <div>
          <label>Sort Order:</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            required
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <button type="submit">Sort Itineraries</button>
      </form>

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

export default SortedItineraries;
