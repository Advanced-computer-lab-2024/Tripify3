import React, { useState } from "react";
import axios from "axios";

const UpdateSellerForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    description: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [updatedSeller, setUpdatedSeller] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "http://localhost:8000/access/seller/updateSeller", // Adjust to your API endpoint
        formData
      );
      setUpdatedSeller(response.data); // Set updated seller data
      setResponseMessage("Seller updated successfully!");
    } catch (error) {
      setResponseMessage("Error: " + error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Update Seller Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Seller</button>
      </form>

      {/* Display response message */}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Display updated seller details */}
      {updatedSeller && (
        <div>
          <h3>Updated Seller Details:</h3>
          <p>Username: {updatedSeller.username}</p>
          <p>Name: {updatedSeller.name}</p>
          <p>Description: {updatedSeller.details?.description}</p>
        </div>
      )}
    </div>
  );
};

export default UpdateSellerForm;
