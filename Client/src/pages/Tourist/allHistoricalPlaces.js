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

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    title: {
      textAlign: 'center',
      fontSize: '2.5rem',
      marginBottom: '40px',
      color: '#2c3e50',
    },
    placesList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
    },
    placeCard: {
      backgroundColor: '#f8f9fa',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      transition: 'transform 0.3s ease',
    },
    placeCardHover: {
      transform: 'translateY(-5px)',
    },
    placeTitle: {
      fontSize: '1.5rem',
      marginBottom: '10px',
      color: '#1abc9c',
    },
    placeDescription: {
      color: '#7f8c8d',
      marginBottom: '20px',
    },
    placeInfo: {
      marginBottom: '20px',
    },
    placeInfoText: {
      margin: '5px 0',
      color: '#34495e',
    },
    placeImages: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    placeImage: {
      width: '100%',
      maxWidth: '100px',
      height: 'auto',
      borderRadius: '5px',
    },
    tagsList: {
      display: 'flex',
      gap: '5px',
      flexWrap: 'wrap',
      marginTop: '10px',
    },
    tagItem: {
      backgroundColor: '#1abc9c',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '5px',
      fontSize: '0.9rem',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Historical Places</h1>
      <div style={styles.placesList}>
        {places.map((place) => (
          <div
            key={place._id}
            style={{
              ...styles.placeCard,
              ':hover': styles.placeCardHover,
            }}
          >
            <h2 style={styles.placeTitle}>{place.name}</h2>
            <p style={styles.placeDescription}>{place.description}</p>
            <div style={styles.placeInfo}>
              <p style={styles.placeInfoText}>
                <strong>Location: </strong>
                {place.location.address}, {place.location.city}, {place.location.country}
              </p>
              <p style={styles.placeInfoText}>
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
                <ul style={styles.tagsList}>
                  {place.tags.map((tag) => (
                    <li key={tag._id} style={styles.tagItem}>{tag.name}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={styles.placeImages}>
              {place.pictures.map((picture, index) => (
                <img key={index} src={picture} alt={`${place.name} picture ${index + 1}`} style={styles.placeImage} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalPlaces;
