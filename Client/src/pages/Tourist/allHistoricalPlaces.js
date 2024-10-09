import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HistoricalPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  const placeTypes = ["Monument", "Religious Site", "Palace", "Castle", "Historical Place", "Museum"];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('http://localhost:8000/places/get');
        setPlaces(response.data.data);
        setFilteredPlaces(response.data.data); // Initialize with all places
        setLoading(false);
      } catch (err) {
        setError('Error fetching places data');
        setLoading(false);
      }
    };

    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getTags'); // Check if this is the correct URL
        setTags(response.data.tags);
      } catch (err) {
        setError('Error fetching tags');
      }
    };

    fetchPlaces();
    fetchTags();
  }, []);

  const handleTagChange = (tagId) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleFilter = async () => {
    try {
      const tagQuery = selectedTags.join(',');
      const response = await axios.get(`http://localhost:8000/places/filter?tags=${tagQuery}&type=${selectedType}`);
      setFilteredPlaces(response.data.data);
    } catch (err) {
      setError('Error applying filter');
    }
  };

  const handleReset = () => {
    setSelectedType('');
    setSelectedTags([]);
    setFilteredPlaces(places); // Reset to all places
  };

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
    filterSection: {
      marginBottom: '20px',
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
    },
    placeTitle: {
      fontSize: '1.5rem',
      marginBottom: '10px',
      color: '#1abc9c',
    },
    tagCheckbox: {
      marginRight: '10px',
    },
    filterButton: {
      marginTop: '10px',
      padding: '10px 15px',
      backgroundColor: '#1abc9c',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    resetButton: {
      marginLeft: '10px',
      padding: '10px 15px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    tagsList: {
      listStyleType: 'none',
      padding: 0,
      marginTop: '10px',
    },
    tagItem: {
      backgroundColor: '#ecf0f1',
      borderRadius: '5px',
      display: 'inline-block',
      padding: '5px 10px',
      marginRight: '5px',
      marginBottom: '5px',
    },
    placeImages: {
      display: 'flex',
      flexWrap: 'wrap',
      marginTop: '10px',
    },
    placeImage: {
      width: '100%',
      maxWidth: '300px',
      marginRight: '10px',
      borderRadius: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Historical Places</h1>

      <div style={styles.filterSection}>
        <h3>Filter Places</h3>

        <div>
          <label>Type of Place:</label>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">Select Type</option>
            {placeTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Tags:</label>
          {tags.map((tag) => (
            <div key={tag._id}>
              <input
                type="checkbox"
                style={styles.tagCheckbox}
                value={tag._id}
                checked={selectedTags.includes(tag._id)}
                onChange={() => handleTagChange(tag._id)}
              />
              <label>{tag.name}</label>
            </div>
          ))}
        </div>

        <button style={styles.filterButton} onClick={handleFilter}>Apply Filter</button>
        <button style={styles.resetButton} onClick={handleReset}>Reset Filter</button>
      </div>

      <div style={styles.placesList}>
        {filteredPlaces.map((place) => (
          <div key={place._id} style={styles.placeCard}>
            <h2 style={styles.placeTitle}>{place.name}</h2>
            <p>{place.description}</p>
            <p>
              <strong>Place Type: </strong>
              {place.type}
            </p>
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
              <ul style={styles.tagsList}>
                {place.tags.map((tag) => (
                  <li key={tag._id} style={styles.tagItem}>{tag.name}</li>
                ))}
              </ul>
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
