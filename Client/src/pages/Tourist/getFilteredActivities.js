import React, { useState } from "react";
import axios from "axios";

const FilteredActivities = () => {
  const [activities, setActivities] = useState([]); // Store the filtered activities
  const [filters, setFilters] = useState({
    budget: "",
    category: "",
    rating: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  // Handle input change for filters
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Handle form submission to apply filters
  const handleFilter = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        "http://localhost:8000/tourist/activity/filter",
        {
          params: filters,
        }
      );
      setActivities(response.data);
      setResponseMessage("");
    } catch (error) {
      setActivities([]);
      setResponseMessage("Failed to fetch filtered activities.");
    }
  };

  return (
    <div>
      <h2>Filter Activities</h2>

      <form onSubmit={handleFilter}>
        <div>
          <label>Budget (Max Price): </label>
          <input
            type="number"
            name="budget"
            value={filters.budget}
            onChange={handleChange}
            placeholder="Enter max price"
          />
        </div>

        <div>
          <label>Category: </label>
          <input
            type="text"
            name="category"
            value={filters.category}
            onChange={handleChange}
            placeholder="Enter category"
          />
        </div>

        <div>
          <label>Rating (Min Rating): </label>
          <input
            type="number"
            name="rating"
            value={filters.rating}
            onChange={handleChange}
            placeholder="Enter min rating"
            min="0"
            max="5"
          />
        </div>

        <button type="submit">Apply Filters</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display filtered activities */}
      {activities.length > 0 && (
        <div>
          <h3>Filtered Activities</h3>
          <ul>
            {activities.map((activity) => (
              <li key={activity._id}>
                <h4>{activity.name}</h4>
                <p>Price: ${activity.price}</p>
                <p>Category: {activity.category}</p>
                <p>Rating: {activity.rating}</p>
                <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilteredActivities;
