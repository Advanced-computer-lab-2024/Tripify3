import React, { useState } from "react";
import axios from "axios";

const AddTourismGovernForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
        "http://localhost:8000/access/admin/addTourismGovern", // Adjust API endpoint as necessary
        formData
      );
      setResponseMessage(`Tourism Governor added: ${response.data.username}`);
    } catch (error) {
      setResponseMessage(
        error.response?.data?.message || "Error adding Tourism Governor."
      );
    }
  };

  return (
    <div>
      <h2>Add Tourism Governor</h2>
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

        <button type="submit">Add Tourism Governor</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default AddTourismGovernForm;
