import React, { useState, useEffect } from "react";
import { getAllIteneraries, filterItineraries, getAllTags } from "../../services/tourist.js"; // Updated API functions

const AllItineraries = () => {
  const [itineraries, setItineraries] = useState([]); // Store the itineraries
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [categories, setCategories] = useState([]); // Store categories
  const [tags, setTags] = useState([]); // Store all tags
  const [selectedTags, setSelectedTags] = useState([]); // Store selected tag IDs
  const [filters, setFilters] = useState({ budget: "", date: "", language: "" }); // Store filter values
  const [validationError, setValidationError] = useState(""); // Validation error message

  // Language options
  const languageOptions = [
    { value: "", label: "Select a language" }, // Placeholder option
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Italian", label: "Italian" },
    { value: "Chinese", label: "Chinese" },
    { value: "Arabic", label: "Arabic" },
    { value: "Russian", label: "Russian" },
    // Add more languages as needed
  ];

  // Fetch itineraries from the backend
  const fetchItineraries = async () => {
    try {
      const response = await getAllIteneraries();
      setItineraries(response.data); // Set itineraries data
      setLoading(false);
    } catch (error) {
      setError("Error fetching itineraries");
      setLoading(false);
    }
  };

  // Fetch tags for the checkboxes
  const fetchTags = async () => {
    try {
      const response = await getAllTags();
      setTags(response.data.tags); // Set tags data
    } catch (error) {
      setError("Error fetching tags");
    }
  };

  // Handle checkbox change for tags
  const handleTagChange = (tagId) => {
    setSelectedTags(
      (prevSelectedTags) =>
        prevSelectedTags.includes(tagId)
          ? prevSelectedTags.filter((id) => id !== tagId) // Uncheck tag
          : [...prevSelectedTags, tagId] // Check tag
    );
  };

  // Validate filter inputs
  const validateFilters = () => {
    if (!filters.budget && !filters.date && selectedTags.length === 0 && !filters.language) {
      setValidationError("Please fill at least one filter field.");
      return false;
    }
    setValidationError(""); // Clear error message if validation passes
    return true;
  };

  // Handle filter submission
  const handleFilter = async () => {
    if (!validateFilters()) return; // Only proceed if validation passes

    // Create a filters object to hold only the selected fields
    const filterParams = {};

    // Add fields to filterParams only if they are not empty
    if (filters.budget) {
      filterParams.budget = filters.budget;
    }
    if (filters.date) {
      filterParams.date = filters.date;
    }
    if (filters.language) {
      filterParams.language = filters.language;
    }
    if (selectedTags.length > 0) {
      filterParams.tags = JSON.stringify(selectedTags); // Send selected tags as an array
    }

    try {
      const response = await filterItineraries(filterParams); // Use the dynamic filterParams object
      console.log(response.data);

      setItineraries(response.data); // Set filtered itineraries
    } catch (error) {
      setError("Error fetching filtered itineraries");
    }
  };

  // Reset filters and fetch all itineraries again
  const handleResetFilters = () => {
    setFilters({ budget: "", date: "", language: "" }); // Reset filter values
    setSelectedTags([]); // Reset selected tags
    setValidationError(""); // Clear validation error
    fetchItineraries(); // Fetch all itineraries
  };

  // Fetch itineraries and tags when component mounts
  useEffect(() => {
    fetchItineraries();
    fetchTags();
  }, []);

  if (loading) {
    return <p style={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Upcoming Itineraries</h2>
      <div style={styles.filterContainer}>
        {/* Date input */}
        <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} style={styles.input} />

        {/* Budget input */}
        <input type="number" placeholder="Budget" value={filters.budget} onChange={(e) => setFilters({ ...filters, budget: e.target.value })} style={styles.input} />

        {/* Language dropdown */}
        <select value={filters.language} onChange={(e) => setFilters({ ...filters, language: e.target.value })} style={styles.input}>
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Tag checkboxes */}
        <div style={styles.tagsContainer}>
          {tags.map((tag) => (
            <label key={tag._id} style={styles.tagLabel}>
              <input type="checkbox" value={tag._id} checked={selectedTags.includes(tag._id)} onChange={() => handleTagChange(tag._id)} />
              {tag.name}
            </label>
          ))}
        </div>

        <button onClick={handleFilter} style={styles.button}>
          Filter
        </button>
        <button onClick={handleResetFilters} style={styles.button}>
          Reset Filters
        </button>
      </div>
      {validationError && <p style={styles.error}>{validationError}</p>} {/* Display validation error */}
      {itineraries.length === 0 ? (
        <p style={styles.noActivities}>No upcoming itineraries available.</p>
      ) : (
        <div style={styles.grid}>
          {itineraries.map((itinerary) => (
            <div key={itinerary._id} style={styles.card}>
              <h3 style={styles.cardHeading}>{itinerary.name}</h3>

              {/* Timeline */}
              <p>
                <strong>Timeline:</strong> {new Date(itinerary.timeline.startTime).toLocaleTimeString()} - {new Date(itinerary.timeline.endTime).toLocaleTimeString()}
              </p>

              {/* Activities */}
              {itinerary.activities.length > 0 && (
                <div>
                  <strong>Activities:</strong>
                  <ul>
                    {itinerary.activities.map((activity) => (
                      <li key={activity._id}>
                        <strong>{activity.name}</strong> - {activity.location} - ${activity.price} - Rating: {activity.rating || "No ratings yet"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Locations */}
              {itinerary.locations.length > 0 && (
                <div>
                  <strong>Locations:</strong>
                  <ul>
                    {itinerary.locations.map((location) => (
                      <li key={location._id}>
                        {location.type} - {location.location}
                        <p>{location.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price and Language */}
              <p>
                <strong>Price:</strong> ${itinerary.price}
              </p>
              <p>
                <strong>Budget:</strong> ${itinerary.budget}
              </p>
              <p>
                <strong>Language:</strong> {itinerary.language}
              </p>

              {/* Tags */}
              {itinerary.tags.length > 0 && (
                <div>
                  <strong>Tags:</strong>
                  {itinerary.tags.map((tag) => (
                    <span key={tag._id} style={styles.tag}>
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Pickup and Dropoff Locations */}
              <p>
                <strong>Pickup Location:</strong> {itinerary.pickupLocation}
              </p>
              <p>
                <strong>Dropoff Location:</strong> {itinerary.dropoffLocation}
              </p>

              {/* Accessibility */}
              <p>
                <strong>Accessibility:</strong> {itinerary.accessibility}
              </p>
            </div>
          ))}
        </div>
      )}
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
  noActivities: {
    fontSize: "18px",
    textAlign: "center",
    margin: "20px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
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
    display: "flex", // Change to flexbox layout
    flexDirection: "row", // Make the items align in a row
    gap: "10px", // Add spacing between each filter field
    alignItems: "center", // Align the items vertically
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    marginBottom: "0", // Remove bottom margin for horizontal alignment
    border: "1px solid #ccc",
    borderRadius: "5px",
    minWidth: "150px", // Set a minimum width for each input field
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#00695c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  tagsContainer: {
    display: "flex", // Make the tags align horizontally
    flexWrap: "wrap", // Allow tags to wrap to the next line if needed
    gap: "10px",
  },
  tagLabel: {
    marginRight: "10px",
  },
};

export default AllItineraries;
