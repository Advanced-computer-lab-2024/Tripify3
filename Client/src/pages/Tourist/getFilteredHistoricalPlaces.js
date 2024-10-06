import React, { useState } from "react";
import axios from "axios";

const FilteredHistoricalPlaces = () => {
  const [tag, setTag] = useState(""); // Tag for filtering
  const [filteredPlaces, setFilteredPlaces] = useState([]); // Store the filtered historical places
  const [responseMessage, setResponseMessage] = useState("");

  // Handle input change for tag
  const handleChange = (e) => {
    setTag(e.target.value);
  };

  // Handle form submission to filter historical places
  const handleFilter = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        "http://localhost:8000/tourist/filterHistoricalPlaces",
        {
          params: { tag },
        }
      ); // Replace with your endpoint

      setFilteredPlaces(response.data);
      setResponseMessage("");
    } catch (error) {
      setFilteredPlaces([]);
      setResponseMessage("Failed to fetch filtered historical places.");
    }
  };

  return (
    <div>
      <h2>Filter Historical Places by Tag</h2>

      <form onSubmit={handleFilter}>
        <div>
          <label>Tag: </label>
          <input
            type="text"
            value={tag}
            onChange={handleChange}
            placeholder="Enter tag"
            required
          />
        </div>
        <button type="submit">Filter Places</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display filtered historical places */}
      {filteredPlaces.length > 0 && (
        <ul>
          {filteredPlaces.map((place) => (
            <li key={place._id}>
              <h3>{place.name}</h3>
              <p>Location: {place.location}</p>
              <p>Tags: {place.tags.map((tag) => tag.name).join(", ")}</p>{" "}
              {/* Assuming tags is an array of objects with a "name" field */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilteredHistoricalPlaces;
