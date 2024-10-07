import React, { useState, useEffect } from "react";
import { getAllPlaces, getFilteredPlaces, getAllTags } from "../../services/tourist.js"; // Import the API functions

const HistoricalPlaces = () => {
  const [places, setPlaces] = useState([]); // Store the places
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [tags, setTags] = useState([]); // Store tags for filtering
  const [selectedTags, setSelectedTags] = useState([]); // Store selected tags for filtering

  // Fetch all places from the backend
  const fetchPlaces = async () => {
    try {
      const response = await getAllPlaces();
      setPlaces(response.data.data); // Set places data
      setLoading(false);
    } catch (error) {
      setError("Error fetching historical places");
      setLoading(false);
    }
  };

  // Fetch all tags from the backend
  const fetchTags = async () => {
    try {
      const response = await getAllTags();
      setTags(response.data.tags); // Set tags data
    } catch (error) {
      setError("Error fetching tags");
    }
  };

  const handleFilter = async () => {
    if (selectedTags.length === 0) {
      setError("Please select at least one tag.");
      return; // Don't proceed if no tags are selected
    }
  
    try {
      // Construct the query string for tags
      const queryParams = `?tags=${JSON.stringify(selectedTags)}`; // Convert the selected tags to a JSON string
  
      // Make a request with query parameters
      const response = await getFilteredPlaces(queryParams); // Modify getFilteredPlaces to handle query string
      setPlaces(response.data.data); // Set the filtered places
      setError(""); // Clear any previous errors
    } catch (error) {
      setError("Error fetching filtered places");
    }
  };
  

  // Reset filters and fetch all places again
  const handleResetFilters = () => {
    setSelectedTags([]); // Clear selected tags
    fetchPlaces(); // Fetch all places again
  };

  // Handle tag checkbox toggle
  const handleTagToggle = (tagId) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId)
        ? prevTags.filter((id) => id !== tagId)
        : [...prevTags, tagId]
    );
  };

  // useEffect to call fetchPlaces and fetchTags when component mounts
  useEffect(() => {
    fetchPlaces();
    fetchTags(); // Fetch all tags on component mount
  }, []);

  if (loading) {
    return <p style={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Historical Places</h2>

      <div style={styles.filterContainer}>
        <div style={styles.tagFilter}>
          <h3 style={styles.subheading}>Filter by Tags</h3>
          <div style={styles.tagRow}>
            {tags.map((tag) => (
              <label key={tag._id} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  value={tag._id}
                  checked={selectedTags.includes(tag._id)}
                  onChange={() => handleTagToggle(tag._id)}
                />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
        <button onClick={handleFilter} style={styles.button}>
          Filter
        </button>
        <button onClick={handleResetFilters} style={styles.button}>
          Reset Filters
        </button>
      </div>

      <div style={styles.grid}>
        {places.length === 0 ? (
          <p style={styles.noPlaces}>No places available.</p>
        ) : (
          places.map((place) => (
            <div key={place._id} style={styles.card}>
              <h3 style={styles.cardHeading}>{place.name}</h3>
              <p>
                <strong>Description:</strong> {place.description}
              </p>
              <p>
                <strong>Location:</strong> {place.location.address}, {place.location.city}, {place.location.country}
              </p>
              <p>
                <strong>Ticket Prices:</strong> Foreigner: ${place.ticketPrices.foreigner}, Native: ${place.ticketPrices.native}, Student: ${place.ticketPrices.student}
              </p>
              <p>
                <strong>Opening Hours:</strong>{" "}
                {place.openingHours.map((hour) => (
                  <span key={hour._id}>
                    {hour.day}: {hour.from} - {hour.to}
                    <br />
                  </span>
                ))}
              </p>
              <p>
                <strong>Tags:</strong> {place.tags.map((tag) => tag.name).join(", ")}
              </p>
              <div style={styles.imageContainer}>
                {place.pictures.map((picture, index) => (
                  <img key={index} src={picture} alt={place.name} style={styles.image} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Styles as JavaScript objects
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    color: "#333",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#00695c",
  },
  loading: {
    fontSize: "18px",
    textAlign: "center",
    margin: "20px 0",
  },
  error: {
    fontSize: "18px",
    color: "red",
    textAlign: "center",
    margin: "20px 0",
  },
  noPlaces: {
    fontSize: "18px",
    textAlign: "center",
    margin: "20px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", // Increased card width
    gap: "20px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  cardHeading: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  tagFilter: {
    marginRight: "20px",
  },
  checkboxLabel: {
    display: "inline-block", // Change to inline-block for horizontal layout
    marginRight: "15px",
  },
  tagRow: {
    display: "flex", // Flexbox for horizontal alignment
    flexWrap: "wrap", // Wrap tags to new line if overflow
    gap: "10px", // Spacing between checkboxes
  },
  imageContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
  },
  button: {
    marginRight: "10px",
    padding: "5px 10px",
    backgroundColor: "#00695c",
    color: "#fff",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
  },
};

export default HistoricalPlaces;
