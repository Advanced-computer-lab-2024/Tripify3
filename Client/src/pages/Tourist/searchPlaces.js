import React, { useState } from 'react';
import axios from 'axios';

const PlaceSearchPage = () => {
  const [searchField, setSearchField] = useState('');
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchField) {
      setError('Please enter a search term.');
      return;
    }

    setError(''); // Clear previous error
    try {
      const response = await axios.post('http://localhost:8000/places/search', {
        searchField: searchField,
      });

      // Assuming the response structure is as described
      setPlaces(response.data.Places);
    } catch (err) {
      setError('Error fetching places. Please try again.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Search Places</h1>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          placeholder="Enter place name"
          style={{ padding: '10px', flex: '1' }}
        />
        <button onClick={handleSearch} style={{ padding: '10px', marginLeft: '10px' }}>
          Search
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        {places.length > 0 ? (
          places.map((place) => (
            <div key={place._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3>{place.name} - {place.type}</h3>
              <p><strong>Address:</strong> {place.location.address}, {place.location.city}, {place.location.country}</p>
              <p><strong>Description:</strong> {place.description}</p>
              <p><strong>Ticket Prices:</strong> Foreigner - ${place.ticketPrices.foreigner}, Native - ${place.ticketPrices.native}, Student - ${place.ticketPrices.student}</p>
              <p><strong>Opening Hours:</strong></p>
              <ul>
                {place.openingHours.map((hour) => (
                  <li key={hour._id}>
                    {hour.day}: {hour.from} - {hour.to}
                  </li>
                ))}
              </ul>
              <p><strong>Tags:</strong> {place.tags.map(tag => tag.name).join(', ')}</p>
              <div>
                <strong>Pictures:</strong>
                {place.pictures.map((pic, index) => (
                  <div key={index} style={{ marginTop: '10px' }}>
                    <img src={pic} alt={`Place ${index + 1}`} style={{ maxWidth: '100%', height: 'auto' }} />
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No places found.</p>
        )}
      </div>
    </div>
  );
};

export default PlaceSearchPage;
