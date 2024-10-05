import React, { useState } from "react";
import axios from "axios";

const UpdateSellerForm = () => {
  const [searchUsername, setSearchUsername] = useState(""); // Username to search
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    description: "",
    name: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [sellerFound, setSellerFound] = useState(false); // Track if seller was found
  const [updatedSeller, setUpdatedSeller] = useState(null); // To store updated seller info

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchUsername(e.target.value);
  };

  // Handle form input change for editing
  const handleChange = (e) => {
    const { name, value } = e.target; // Use name to identify the field
    setFormData({ ...formData, [name]: value });
  };

  // Search for seller by username
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        `http://localhost:8000/access/seller/viewSeller?username=${searchUsername}` // Adjust to your API endpoint
      );
      const seller = response.data;
      setFormData({
        username: seller.username,
        name: seller.name,
        email: seller.email,
        description: seller.description,
      });
      setSellerFound(true);
      setResponseMessage("");
    } catch (error) {
      setSellerFound(false);
      setResponseMessage("Seller not found.");
    }
  };

  // Handle submit for updating seller details
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "http://localhost:8000/access/seller/updateSeller", // Adjust to your API endpoint
        formData // Only send the description for updating
      );
      setUpdatedSeller(response.data); // Set updated seller data
      setResponseMessage("Seller updated successfully!");
    } catch (error) {
      setUpdatedSeller(null);
      setResponseMessage("Error: " + error.response.data.message);
    }
    console.log("response", updatedSeller);
  };

  return (
    <div>
      <h2>Search for Seller</h2>
      <form onSubmit={handleSearchSubmit}>
        <div>
          <label>Enter Username:</label>
          <input
            type="text"
            value={searchUsername}
            onChange={handleSearchChange}
            required
          />
        </div>
        <button type="submit">Search Seller</button>
      </form>

      {sellerFound ? (
        <>
          <h2>Edit Seller Information</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                readOnly // Prevent editing of the username
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                readOnly // Prevent editing of the email
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
        </>
      ) : (
        <p>{responseMessage}</p>
      )}

      {/* Display updated seller details */}
      {updatedSeller && (
        <div>
          <h3>Updated Seller Details:</h3>
          <p>Username: {updatedSeller.username}</p>
          <p>Email: {updatedSeller.email}</p>
          <p>Name: {updatedSeller.name}</p>
          <p>Description: {updatedSeller.description}</p>
        </div>
      )}
    </div>
  );
};

export default UpdateSellerForm;
