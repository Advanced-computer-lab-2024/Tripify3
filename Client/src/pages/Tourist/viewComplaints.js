import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewComplaints = () => {
  const { id } = useParams(); // Extract the ID from URL parameters
  console.log(id);
  const [complaints, setComplaints] = useState([]); // State to hold complaints
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error
  const [searchName, setSearchName] = useState(''); // State for search input
  const [selectedStatus, setSelectedStatus] = useState(''); // State for selected status
  const [filteredComplaints, setFilteredComplaints] = useState([]); // State for filtered complaints

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/tourist/complaints/${id}`);
        console.log("fetch success");
        setComplaints(response.data); // Set the fetched complaints in state
        setFilteredComplaints(response.data); // Initialize filtered complaints
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

  useEffect(() => {
    // Filter complaints whenever searchName or selectedStatus changes
    const filtered = complaints.filter(complaint => {
      const matchesName = complaint.title.toLowerCase().includes(searchName.toLowerCase());
      const matchesStatus = selectedStatus ? complaint.status === selectedStatus : true;
      return matchesName && matchesStatus;
    });
    setFilteredComplaints(filtered);
  }, [searchName, selectedStatus, complaints]);

  const resetFilters = () => {
    setSearchName('');
    setSelectedStatus('');
    setFilteredComplaints(complaints); // Reset to original complaints
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading state
  }

  if (error) {
    return <div>{error}</div>; // Render error message
  }

  return (
    <div className="container">
      <style>
        {`
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
            background-color: #f0f0f0; /* Fixed extra '#' */
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Adjusted box-shadow for a more pronounced effect */
            flex-grow: 1; /* Allow container to grow and take available space */
          }

          h1 {
            text-align: center;
            color: #333;
          }

          input[type="text"],
          select {
            width: calc(100% - 20px); /* Full width minus padding */
            padding: 10px;
            margin: 10px 0; /* Space above and below */
            border: 1px solid #ccc; /* Light gray border */
            border-radius: 4px; /* Rounded corners */
            font-size: 16px; /* Font size */
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
          }

          input[type="text"]:focus,
          select:focus {
            border-color: #007bff; /* Change border color on focus */
            outline: none; /* Remove default outline */
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Highlight with a blue glow */
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
      
      <div>
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchName} 
          onChange={(e) => setSearchName(e.target.value)} 
        />
        
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <button onClick={resetFilters}>Reset Filters</button>
      </div>

      {filteredComplaints.length > 0 ? (
        <ul>
          {filteredComplaints.map((complaint) => (
            <li key={complaint._id}>
              <h2>{complaint.title}</h2> 
              <p><strong>Date: </strong>{new Date(complaint.date).toLocaleDateString()}</p>
              <p><strong>Body: </strong>{complaint.body}</p>
              <p><strong>Description: </strong>{complaint.description}</p>
              <p><strong>Status: </strong>{complaint.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No complaints found.</p>
      )}
    </div>
  );
};

export default ViewComplaints;
