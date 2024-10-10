import React, { useState } from "react";
import axios from "axios";

const AddAdminForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    type: "Admin"
  });
  const [responseMessage, setResponseMessage] = useState(""); // State to store the response

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the post request to the backend API
      const response = await axios.post(
        "http://localhost:8000/admin/addAdmin", // Adjust API endpoint as necessary
        formData
      );
      setResponseMessage(`Admin added: ${response.data.username}`);
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || "Error adding Admin."
      );
    }
  };

  return (
    <div>
      <h2>Add Admin</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <button type="submit">Add Admin</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AddAdminForm;
