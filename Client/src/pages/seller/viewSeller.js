import React, { useState, useEffect } from "react";
import axios from "axios";
import { getUsername } from "../../utils/authUtils.js";

const ViewSellerPage = () => {
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState(""); // Display message

  // Fetch seller info when the component mounts
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const username = getUsername(); // Get the username
        const response = await axios.get(
          `http://localhost:8000/access/seller/viewSeller?username=${username}`
        );
        setSeller(response.data); // Set the seller data from the response
      } catch (error) {
        setSeller(null); // Reset the seller data if error occurs
        setMessage("Seller not found"); // Display error message
        console.error("Error:", error);
      }
    };

    fetchSeller(); // Call the function when the component mounts
  }, []); // Empty dependency array to run effect only once on mount

  return (
    <div>
      <h1>View Seller</h1>
      {seller ? (
        <div>
          <h2>Seller Details</h2>
          <li>Name: {seller.name}</li>
          <li>Username: {seller.username}</li>
          <li>Email: {seller.email}</li>
          <li>Description: {seller.description}</li>
        </div>
      ) : (
        <h3>{message}</h3>
      )}
    </div>
  );
};

export default ViewSellerPage;
