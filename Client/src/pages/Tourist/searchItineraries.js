import React, { useState } from 'react';
import axios from 'axios';

const SearchItineraries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [itineraries, setItineraries] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submission to search for itineraries
  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:8000/itineraries/search', {
        searchField: searchTerm,
      });

      setItineraries(response.data.itineraries); // Store the fetched itineraries
      setErrorMessage(''); // Clear any previous error message
    } catch (error) {
      setErrorMessage('Error fetching itineraries. Please try again.');
      setItineraries([]); // Clear previous results
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Search Itineraries</h1>

      {/* Search Field and Button */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term"
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}

      {/* Display Itineraries */}
      {itineraries.length > 0 ? (
        <div style={styles.itineraryContainer}>
          {itineraries.map((itinerary) => (
            <div key={itinerary._id} style={styles.itineraryCard}>
              <h2 style={styles.itineraryName}>{itinerary.name}</h2>
              <p><strong>Price:</strong> ${itinerary.price}</p>
              <p><strong>Language:</strong> {itinerary.language}</p>
              <p><strong>Budget:</strong> ${itinerary.budget}</p>
              <p><strong>Pickup Location:</strong> {itinerary.pickupLocation}</p>
              <p><strong>Dropoff Location:</strong> {itinerary.dropoffLocation}</p>
              <p><strong>Accessibility:</strong> {itinerary.accessibility}</p>

              {/* Available Dates */}
              <h4>Available Dates:</h4>
              <ul>
                {itinerary.availableDates.map((date) => (
                  <li key={date._id}>
                    {new Date(date.date).toLocaleDateString()} (Times: {date.times.join(', ')})
                  </li>
                ))}
              </ul>

              {/* Activities */}
              <h4>Activities:</h4>
              <ul>
                {itinerary.activityDetails.map((activity) => (
                  <li key={activity._id}>
                    <strong>Name:</strong> {activity.name} | <strong>Location:</strong> {activity.location} | <strong>Price:</strong> ${activity.price} | <strong>Rating:</strong> {activity.rating}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        searchTerm && <p>No itineraries found for the search term.</p>
      )}
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '300px',
    marginRight: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#00695c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
  },
  itineraryContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  itineraryCard: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  itineraryName: {
    fontSize: '22px',
    color: '#00695c',
  },
};

export default SearchItineraries;