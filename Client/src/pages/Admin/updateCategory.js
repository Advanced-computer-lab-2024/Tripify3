import React, { useState } from "react";
import axios from "axios";

const UpdateCategoryForm = () => {
  const [oldName, setOldName] = useState(""); // Old category name
  const [newName, setNewName] = useState(""); // New category name
  const [responseMessage, setResponseMessage] = useState(""); // Response message

  // Handle form submission for updating category
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the update request
      const response = await axios.put(
        "http://localhost:8000/access/admin/updateCategory",
        {
          oldName,
          newName,
        }
      );

      setResponseMessage(`Category updated: ${response.data.name}`);
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || "Error updating category."
      );
    }
  };

  return (
    <div>
      <h2>Update Category</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Old Category Name:</label>
          <input
            type="text"
            value={oldName}
            onChange={(e) => setOldName(e.target.value)}
            placeholder="Enter old category name"
            required
          />
        </div>

        <div>
          <label>New Category Name:</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new category name"
            required
          />
        </div>

        <button type="submit">Update Category</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default UpdateCategoryForm;
