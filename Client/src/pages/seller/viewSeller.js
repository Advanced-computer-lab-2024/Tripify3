import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewSellerPage = () => {
  const [seller, setSeller] = useState(null);
  const [username, setUsername] = useState(""); // Input field for username
  const [message, setMessage] = useState(""); // Display message

  const fetchSeller = async (username) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/access/seller/viewSeller?username=${username}`
      );
      setSeller(response.data); // Set the seller data from the response
    } catch (error) {
      setSeller(null); // Reset the seller data
      setMessage("Seller not found"); // Display error message
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
        onKeyUp={() => handleSearch()} // Call handleSearch on Enter key press
      />
      {/* <button onClick={handleSearch}>Search</button> */}
      {seller ? (
        <div>
          <h2>Seller Details</h2>
          <li>Email: {seller.email}</li>
          <li>Username: {seller.username}</li>
          {/* Access nested field for description */}
          <li>Description: {seller.description}</li>
        </div>
      ) : (
        <h3>{message}</h3>
      )}
    </div>
  );
};

export default ViewSellerPage;
