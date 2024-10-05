import React, { useState } from "react";
import axios from "axios";

const AddTagForm = () => {
  const [tagName, setTagName] = useState(""); // State to store tag name
  const [responseMessage, setResponseMessage] = useState(""); // Response message

  // Handle form submission for adding a tag
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to add a new tag
      const response = await axios.post(
        "http://localhost:8000/access/admin/addTag",
        {
          name: tagName,
        }
      );

      setResponseMessage(`Tag added: ${response.data.name}`);
      setTagName(""); // Clear the input field after submission
    } catch (error) {
      setResponseMessage(error.response?.data?.message || "Error adding tag.");
    }
  };

  return (
    <div>
      <h2>Add Tag</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Tag Name:</label>
          <input
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Enter tag name"
            required
          />
        </div>

        <button type="submit">Add Tag</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AddTagForm;
