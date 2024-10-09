import React, { useState } from "react";
import axios from "axios";

const DeleteTagForm = () => {
  const [tagName, setTagName] = useState(""); // Tag name to be deleted
  const [responseMessage, setResponseMessage] = useState(""); // Response message

  // Handle form submission for deleting tag
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send DELETE request to remove the tag
      const response = await axios.delete(
        "http://localhost:8000/access/admin/deleteTag",
        {
          data: { name: tagName },
        }
      );

      setResponseMessage(`Tag deleted: ${response.data.name}`);

      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
      
      setTagName(""); // Clear input field after submission
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || "Error deleting tag."
      );
    }
  };

  return (
    <div>
      <h2>Delete Tag</h2>

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

        <button type="submit">Delete Tag</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default DeleteTagForm;
