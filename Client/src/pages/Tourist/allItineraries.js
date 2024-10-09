import React, { useState, useEffect } from "react";
import { getAllIteneraries, getAllTags } from "../../services/tourist.js"; // Updated API functions

const AllItineraries = () => {
  const [itineraries, setItineraries] = useState([]); // Store the itineraries
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [tags, setTags] = useState([]); // Store all tags
  const [selectedTags, setSelectedTags] = useState([]); // Store selected tag IDs
  const [selectedLanguages, setSelectedLanguages] = useState([]); // Store selected languages
  const [sortOrder, setSortOrder] = useState(""); // Sorting by price
  const [validationError, setValidationError] = useState(""); // Validation error message
  const [budget, setBudget] = useState(""); // Budget input state

  // Language options
  const languageOptions = [
    { value: "English", label: "English" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Arabic", label: "Arabic" },
    { value: "Russian", label: "Russian" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "Italian", label: "Italian" },
  ];

  // Fetch itineraries from the backend
  const fetchItineraries = async () => {
    try {
      const response = await getAllIteneraries();
      // Ensure the itineraries have the new tags field
      const itinerariesWithTags = response.data.map((itinerary) => ({
        ...itinerary,
        tags: itinerary.tags || [], // Initialize tags if not present
      }));
      console.log(itinerariesWithTags);

      setItineraries(itinerariesWithTags); // Set itineraries data
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

  // Handle checkbox change for languages
  const handleLanguageChange = (language) => {
    setSelectedLanguages(
      (prevSelectedLanguages) =>
        prevSelectedLanguages.includes(language)
          ? prevSelectedLanguages.filter((lang) => lang !== language) // Uncheck language
          : [...prevSelectedLanguages, language] // Check language
    );
  };

  // Validate filter inputs
  const validateFilters = () => {
    if (selectedTags.length === 0 && selectedLanguages.length === 0 && !budget) {
      setValidationError("Please select at least one filter or set a budget.");
      return false;
    }
    setValidationError(""); // Clear error message if validation passes
    return true;
  };

  // Filter itineraries based on selected languages, tags, and budget
  // Filter itineraries based on selected languages, tags, and budget
  const handleFilter = () => {
    if (!validateFilters()) return; // Only proceed if validation passes

    const filteredItineraries = itineraries.filter((itinerary) => {
      const hasSelectedTags = selectedTags.length === 0 || itinerary.tags.some((tag) => selectedTags.includes(tag._id));

      // Update the hasSelectedLanguages logic to check if itinerary.language is included in selectedLanguages
      const hasSelectedLanguages = selectedLanguages.length === 0 || selectedLanguages.includes(itinerary.language);

      const isWithinBudget = budget ? itinerary.price <= budget : true;

      return hasSelectedTags && hasSelectedLanguages && isWithinBudget;
    });

    setItineraries(filteredItineraries); // Update the itineraries with filtered results
  };

  // Handle sorting by price
  const handleSortByPrice = () => {
    const sortedItineraries = [...itineraries].sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });
    setItineraries(sortedItineraries);
  };

  // Reset filters and fetch all itineraries again
  const handleResetFilters = () => {
    setSelectedTags([]); // Reset selected tags
    setSelectedLanguages([]); // Reset selected languages
    setBudget(""); // Reset budget input
    setValidationError(""); // Clear validation error
    fetchItineraries(); // Fetch all itineraries again
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
    
    {/* Sorting input */}
    <div style={styles.sortContainer}>
      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={styles.input}>
        <option value="">Sort by Price</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>
      <button onClick={handleSortByPrice} style={styles.button}>
        Sort
      </button>
    </div>
    
    {/* Filters - Languages, Tags, Budget, Filter/Reset Buttons */}
    <div style={styles.filterContainer}>
      <div style={styles.checkboxRow}>
        {/* Tags */}
        <div style={styles.tagsContainer}>
          Tags:
          {tags.map((tag) => (
            <label key={tag._id} style={styles.tagLabel}>
              <input type="checkbox" value={tag._id} checked={selectedTags.includes(tag._id)} onChange={() => handleTagChange(tag._id)} />
              {tag.name}
            </label>
          ))}
        </div>

      
  
        {/* Languages */}
        <div style={styles.languageContainer}>
        Languages:
          {languageOptions.map((option) => (
            
            <label key={option.value} style={styles.languageLabel}>
              <input type="checkbox" checked={selectedLanguages.includes(option.value)} onChange={() => handleLanguageChange(option.value)} />
              {option.label}
            </label>
          ))}
        </div>
  
        {/* Budget */}
        <div style={styles.budgetContainer}>
          <label style={styles.budgetLabel}>
            Budget:
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} style={styles.budgetInput} placeholder="Enter your budget" />
          </label>
        </div>
      </div>
  
      {/* Filter/Reset Buttons */}
      <div style={styles.buttonGroup}>
        <button onClick={handleFilter} style={styles.button}>
          Filter
        </button>
        <button onClick={handleResetFilters} style={styles.button}>
          Reset Filters
        </button>
      </div>
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
              {itinerary.places.length > 0 && (
                <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                  <h2 style={{ color: "#333", marginBottom: "15px" }}>Places to Visit:</h2>
                  <ul style={{ listStyleType: "none", padding: "0" }}>
                    {itinerary.places.map((place) => (
                      <li
                        key={place._id}
                        style={{ marginBottom: "15px", padding: "10px", backgroundColor: "#fff", borderRadius: "5px", border: "1px solid #ddd", transition: "transform 0.2s", cursor: "pointer" }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        <h4 style={{ margin: "5px 0", color: "#007BFF" }}>{place.type}</h4>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span style={{ fontWeight: "bold" }}>{place.location.address}</span>
                          <span style={{ margin: "0 10px" }}>-</span>
                          <span>{place.location.city}</span>
                        </div>
                        <p style={{ marginTop: "5px", color: "#666", fontSize: "0.9em" }}>{place.description}</p>
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
                <strong>Language:</strong> {itinerary.language}
              </p>

              {/* Tags */}
              {itinerary.tags.length > 0 && (
                <div>
                  <strong>Tags:</strong>
                  <ul>
                    {itinerary.tags.map((tag, index) => (
                      <li key={index}>{tag}</li> // Render each tag
                    ))}
                  </ul>
                </div>
              )}
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
    color: "#00695C",
  },
  loading: {
    fontSize: "18px",
    color: "#555",
  },
  error: {
    color: "red",
    marginBottom: "20px",
  },
  sortContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  filterContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minWidth: "150px",
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  tagLabel: {
    display: "flex",
    alignItems: "center",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#00695C",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  cardHeading: {
    fontSize: "20px",
    marginBottom: "10px",
    color: "#00695C",
  },
  noActivities: {
    fontSize: "16px",
    color: "#666",
  },
};

export default AllItineraries;
