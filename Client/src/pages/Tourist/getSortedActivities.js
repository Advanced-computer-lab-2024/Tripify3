import React, { useState } from "react";
import axios from "axios";

const SortedActivities = () => {
  const [activities, setActivities] = useState([]); // Store the sorted activities
  const [sortOptions, setSortOptions] = useState({
    sortBy: "price", // Default sorting by price
    sortOrder: "asc", // Default ascending order
  });
  const [responseMessage, setResponseMessage] = useState("");

  // Handle sorting input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSortOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  // Handle form submission to apply sorting
  const handleSort = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        "http://localhost:8000/tourist/activity/sort",
        {
          params: sortOptions,
        }
      );
      setActivities(response.data);
      setResponseMessage("");
    } catch (error) {
      setActivities([]);
      setResponseMessage("Failed to fetch sorted activities.");
    }
  };

  return (
    <div>
      <h2>Sort Activities</h2>

      <form onSubmit={handleSort}>
        <div>
          <label>Sort By: </label>
          <select
            name="sortBy"
            value={sortOptions.sortBy}
            onChange={handleChange}
          >
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="date">Date</option>
          </select>
        </div>

        <div>
          <label>Order: </label>
          <select
            name="sortOrder"
            value={sortOptions.sortOrder}
            onChange={handleChange}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <button type="submit">Apply Sorting</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display sorted activities */}
      {activities.length > 0 && (
        <div>
          <h3>Sorted Activities</h3>
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

export default SortedActivities;
