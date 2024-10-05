import React, { useState } from "react";
import axios from "axios";

const AddCategoryForm = () => {
  const [categoryName, setCategoryName] = useState(""); // State to store category name
  const [responseMessage, setResponseMessage] = useState(""); // State to store the response message

  // Handle input changes
  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to add a new category
      const response = await axios.post(
        "http://localhost:8000/access/admin/addCategory", // Replace with your actual API endpoint
        { name: categoryName }
      );

      // Set success response
      setResponseMessage(`Category added: ${response.data.name}`);
    } catch (error) {
      // Set error response
      setResponseMessage(
        error.response?.data?.message || "Error adding category."
      );
    }
  };

  return (
    <div>
      <h2>Add New Category</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name:</label>
          <input
            type="text"
            value={categoryName}
            onChange={handleChange}
            placeholder="Enter category name"
            required
          />
        </div>

        <button type="submit">Add Category</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AddCategoryForm;
