import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewCategories = () => {
  const [categories, setCategories] = useState([]); // Store categories
  const [responseMessage, setResponseMessage] = useState(""); // Response message for errors or success

  // Fetch categories when the component is loaded
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/access/admin/viewCategory"
        );
        setCategories(response.data); // Set the categories in the state
        setResponseMessage("");
      } catch (error) {
        setResponseMessage("Error fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2>View Categories</h2>

      {/* Display categories */}
      {categories.length > 0 ? (
        <ul>
          {categories.map((category) => (
            <li key={category._id}>{category.name}</li>
          ))}
        </ul>
      ) : (
        <p>{responseMessage}</p>
      )}
    </div>
  );
};

export default ViewCategories;
