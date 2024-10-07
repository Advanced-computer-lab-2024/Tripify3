import React, { useState } from "react";
import axios from "axios";

const UpdateTagForm = () => {
  const [oldName, setOldName] = useState(""); // Old tag name
  const [newName, setNewName] = useState(""); // New tag name
  const [responseMessage, setResponseMessage] = useState(""); // Response message

  // Handle form submission for updating tag
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send PUT request to update the tag
      const response = await axios.put(
        "http://localhost:8000/access/admin/updateTag",
        {
          oldName,
          newName,
        }
      );

      setResponseMessage(`Tag updated: ${response.data.name}`);
      
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
      setOldName("");
      setNewName("");
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || "Error updating tag."
      );
    }
  };

  return (
    <div>
      <h2>Update Tag</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Old Tag Name:</label>
          <input
            type="text"
            value={oldName}
            onChange={(e) => setOldName(e.target.value)}
            placeholder="Enter old tag name"
            required
          />
        </div>

        <div>
          <label>New Tag Name:</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new tag name"
            required
          />
        </div>

        <button type="submit">Update Tag</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default UpdateTagForm;
