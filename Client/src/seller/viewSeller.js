import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewSellerPage = () => {
  const [seller, setSeller] = useState(null);
  const [username, setUsername] = useState(""); // Input field for username

  const fetchSeller = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/access/seller/viewSeller?username=${username}`
      );
      setSeller(response.data); // Set the seller data from the response
    } catch (error) {
      setSeller(null); // Reset the seller data
      console.error("Error:", error);
    }
  };

  const handleSearch = () => {
    console.log("Searching for seller:", username);
    fetchSeller(username); // Call the API when the button is clicked
  };

  return (
    <div>
      <h1>View Seller</h1>
      <input
        type="text"
        placeholder="Enter seller username"
        value={username}
        onChange={(e) => setUsername(e.target.value)} // Update input value
      />
      <button onClick={handleSearch}>Search</button>

      {seller && (
        <div>
          <h2>Seller Details</h2>
          <li>Name: {seller.name}</li>
          <li>Email: {seller.email}</li>
          <li>Username: {seller.username}</li>
          {/* Access nested field for description */}
          {seller.details && seller.details.description && (
            <h2>Description: {seller.details.description}</h2>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewSellerPage;
