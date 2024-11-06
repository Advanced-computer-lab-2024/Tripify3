import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ActivateDeactivateItinerary = () => {
  const { tourGuideId } = useParams();
  console.log('Tour Guide ID:', tourGuideId);  // Check if this is undefined
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch itineraries when component mounts
  useEffect(() => {
    if (tourGuideId) {  // Only fetch if tourGuideId is available
      const fetchItineraries = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/tourGuide/itineraries/${tourGuideId}`);
          setItineraries(response.data);
        } catch (error) {
          setError('Failed to fetch itineraries');
        } finally {
          setLoading(false);
        }
      };
  
      fetchItineraries();
    } else {
      setLoading(false);  // Avoid indefinite loading if tourGuideId is missing
    }
  }, [tourGuideId]);

  // Activate an itinerary
  const activateItinerary = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8000/itinerary/activate/${id}`);
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, status: 'Active' } : itinerary
        )
      );
      setActionMessage(response.data.message);
    } catch (error) {
      setActionMessage(error.response?.data?.message || 'Error activating itinerary');
    }
  };

  // Deactivate an itinerary
  const deactivateItinerary = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8000/itinerary/deactivate/${id}`);
      setItineraries((prevItineraries) =>
        prevItineraries.map((itinerary) =>
          itinerary._id === id ? { ...itinerary, status: 'Inactive' } : itinerary
        )
      );
      setActionMessage(response.data.message);
    } catch (error) {
      setActionMessage(error.response?.data?.message || 'Error deactivating itinerary');
    }
  };

  // Filter itineraries based on search term and status
  const filteredItineraries = itineraries.filter(itinerary => {
    const matchesSearch = itinerary.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || itinerary.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Display loading state or error message
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <style>
        {`
          /* General styling for the container */
.container {
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Stack items vertically */
  padding: 20px; /* Add some padding around the container */
  margin: 0 auto; /* Center the container */
  max-width: 1200px; /* Limit the maximum width */
}

/* Navbar and Sidebar spacing */
.navbar {
  height: 60px; /* Fixed height for navbar */
  background-color: #333; /* Navbar background color */
  color: white; /* Navbar text color */
  display: flex; /* Flexbox for navbar items */
  align-items: center; /* Center items vertically */
  padding: 0 20px; /* Padding on sides */
}

.sidebar {
  width: 200px; /* Fixed width for sidebar */
  background-color: #f4f4f4; /* Sidebar background color */
  padding: 20px; /* Padding inside the sidebar */
  position: fixed; /* Fix the sidebar to the left */
  top: 60px; /* Start below the navbar */
  bottom: 0; /* Extend to the bottom of the page */
}

/* Itinerary styling */
.itinerary {
  background-color: #fff; /* White background for itineraries */
  border: 1px solid #ddd; /* Light border around itineraries */
  border-radius: 8px; /* Rounded corners */
  padding: 15px; /* Inner padding */
  margin: 10px 0; /* Margin between itineraries */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow effect */
}

/* Headings styling */
h1 {
  font-size: 2rem; /* Size for main heading */
  margin-bottom: 20px; /* Space below the heading */
  color: #333; /* Dark color for the heading */
}

h2 {
  font-size: 1.5rem; /* Size for itinerary heading */
  color: #007BFF; /* Blue color for itinerary titles */
  margin: 0; /* Remove default margin */
}

/* Button styling */
button {
  background-color: #007BFF; /* Blue background */
  color: white; /* White text color */
  border: none; /* No border */
  border-radius: 4px; /* Rounded corners */
  padding: 10px 15px; /* Padding inside buttons */
  cursor: pointer; /* Pointer cursor on hover */
  transition: background-color 0.3s; /* Smooth transition on hover */
}

button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

/* Action message styling */
.action-message {
  margin-top: 20px; /* Space above action message */
  color: #333; /* Dark color for messages */
}
        `}
      </style>

      <h1>Manage Itineraries</h1>

      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px' }}
      >
        <option value="All">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

      {filteredItineraries.length === 0 ? (
        <p>No itineraries found for this tour guide.</p>
      ) : (
        filteredItineraries.map((itinerary) => (
          <div key={itinerary._id} className="itinerary">
            <h2>{itinerary.name}</h2>
            <p>Status: {itinerary.status}</p>
            <p>Price: {itinerary.price}</p>
            <p>Language: {itinerary.language}</p>
            <p>Pickup Location: {itinerary.pickupLocation}</p>
            <p>Dropoff Location: {itinerary.dropoffLocation}</p>
            <p>Accessibility: {itinerary.accessibility}</p>
            <p>Bookings: {itinerary.bookings.length}</p>

            {itinerary.status === 'Inactive' && (
              <button onClick={() => activateItinerary(itinerary._id)}>Activate</button>
            )}

            {itinerary.status === 'Active' && itinerary.bookings.length > 0 && (
              <button onClick={() => deactivateItinerary(itinerary._id)}>Deactivate</button>
            )}

            {itinerary.status === 'Active' && itinerary.bookings.length === 0 && (
              <p>This itinerary cannot be deactivated as it has no bookings.</p>
            )}
          </div>
        ))
      )}
      {actionMessage && <div>{actionMessage}</div>}
    </div>
  );
};

export default ActivateDeactivateItinerary;
