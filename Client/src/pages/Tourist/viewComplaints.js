import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewComplaints = () => {
  const { id } = useParams(); // Extract the ID from URL parameters
  const [complaints, setComplaints] = useState([]); // State to hold complaints
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tourist/complaints/${id}`);
        setComplaints(response.data); // Set the fetched complaints in state
      } catch (error) {
        console.error('Error fetching complaints:', error);
        setError('Failed to fetch complaints.'); // Set error message in state
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    if (id) { // Check if id is defined before fetching
      fetchComplaints();
    } else {
      console.error('ID is undefined');
      setLoading(false); // Stop loading if ID is not defined
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>; // Render loading state
  }

  if (error) {
    return <div>{error}</div>; // Render error message
  }

  return (
    <div>
        <style>
        {`
          /* ViewComplaints.css */

body {
    display: flex;
    justify-content: center; /* Center the content horizontally */
    align-items: flex-start; /* Align items at the start vertically */
    min-height: 100vh; /* Make sure the body takes full height */
    margin: 0; /* Remove default margin */
    padding-top: 60px; /* Space for the navbar, adjust as necessary */
    background-color: #f0f0f0; /* Optional background color */
}

.container {
    max-width: 800px;
    margin: 0 20px; /* Allow some space for the sidebar */
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    flex-grow: 1; /* Allow container to grow and take available space */
}

h1 {
    text-align: center;
    color: #333;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    background: #fff;
    margin: 10px 0;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

h2 {
    margin: 0 0 10px;
    color: #007bff;
}

p {
    margin: 5px 0;
    color: #555;
}

.loading {
    text-align: center;
    font-size: 1.2em;
    color: #007bff;
}

.error {
    text-align: center;
    color: red;
    font-weight: bold;
}

.no-complaints {
    text-align: center;
    color: #777;
}


  
        `}
      </style>
      <h1>All Complaints</h1>
    {complaints.length > 0 ? (
      <ul>
        {complaints.map((complaint) => (
          <li key={complaint._id}>
            <h2>{complaint.title}</h2> {/* Adjust according to your complaint object structure */}
            <p><strong>Date: </strong> {new Date(complaint.date).toLocaleDateString()}</p> {/* Display the formatted date */}
            <p><strong>Body:  </strong>{complaint.body}</p> {/* Adjust according to your complaint object structure */}
            <p><strong>Description: </strong>{complaint.description}</p> {/* Adjust according to your complaint object structure */}
            <p><strong>Status: </strong> {complaint.status}</p> {/* Adjust according to your complaint object structure */}
          </li>
        ))}
      </ul>
    ) : (
      <p>No complaints found for this user.</p>
    )}
    </div>
  );
};

export default ViewComplaints;
