import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoricalPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://localhost:8000/places/get');
        setPlaces(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Historical Places</h1>
      <div className="places-list">
        {places.map((place) => (
          <div key={place._id} className="place-card">
            <h2>{place.name}</h2>
            <p>{place.description}</p>
            <div className="place-info">
              <p>
                <strong>Location: </strong>
                {place.location.address}, {place.location.city}, {place.location.country}
              </p>
              <p>
                <strong>Ticket Prices: </strong>
                Foreigner: {place.ticketPrices.foreigner} EGP, Native: {place.ticketPrices.native} EGP, Student: {place.ticketPrices.student} EGP
              </p>
              <div>
                <strong>Opening Hours:</strong>
                <ul>
                  {place.openingHours.map((hours) => (
                    <li key={hours._id}>
                      {hours.day}: {hours.from} - {hours.to}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Tags:</strong>
                <ul>
                  {place.tags.map((tag) => (
                    <li key={tag._id}>{tag.name}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="place-images">
              {place.pictures.map((picture, index) => (
                <img key={index} src={picture} alt={`${place.name} picture ${index + 1}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalPlaces;
