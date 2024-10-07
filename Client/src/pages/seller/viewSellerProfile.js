import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams from react-router-dom

const ViewSellerPage = () => {
  const { id } = useParams(); // Get the id from the URL params
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState(""); // Display message

  // Fetch seller info when the component mounts or when id changes
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/access/seller/findSeller?id=${id}`
        );
        setSeller(response.data); // Set the seller data from the response
      } catch (error) {
        setSeller(null); // Reset the seller data if error occurs
        setMessage("Seller not found"); // Display error message
        console.error("Error:", error);
      }
    };

    if (id) {
      fetchSeller(); // Call the function when id is available
    }
  }, [id]); // Add id as a dependency to refetch when it changes

  return (
    <div>
      <h1>View Seller</h1>
      {seller ? (
        <div>
          <h2>Seller Details</h2>
          <ul>
            <li>Name: {seller.name}</li>
            <li>Username: {seller.username}</li>
            <li>Email: {seller.email}</li>
            <li>Description: {seller.description}</li>
          </ul>
        </div>
      ) : (
        <h3>{message}</h3>
      )}
    </div>
  );
};

export default ViewSellerPage;
