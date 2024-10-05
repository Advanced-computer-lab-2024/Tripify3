import React, { useState } from "react";
import axios from "axios";

const DeleteUserForm = () => {
  const [username, setUsername] = useState(""); // State to track the username input
  const [responseMessage, setResponseMessage] = useState(""); // State to store the server's response

  // Handle input change
  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  // Handle form submission (delete user)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.delete(
        "http://localhost:8000/access/admin/deleteUser", // Adjust to your API endpoint
        {
          data: { username }, // Pass the username in the body
        }
      );

      // Set the server's response
      setResponseMessage(
        `User deleted successfully: ${response.data.username}`
      );
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || "Failed to delete user."
      );
    }
  };

  return (
    <div>
      <h2>Delete User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Enter Username to Delete:</label>
          <input
            type="text"
            value={username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
        </div>
        <button type="submit">Delete User</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default DeleteUserForm;
