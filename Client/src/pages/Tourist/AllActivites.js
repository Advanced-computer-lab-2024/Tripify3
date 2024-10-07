import React, { useState, useEffect } from "react";
import { getAllActivities, getAllCategories } from "../../services/tourist.js"; // Import the API function

const AllActivities = () => {
  const [activities, setActivities] = useState([]); // Store the filtered activities
  const [originalActivities, setOriginalActivities] = useState([]); // Store the original activities
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [categories, setCategories] = useState([]); // Store categories
  const [filters, setFilters] = useState({
    budget: "",
    selectedCategories: [],
    rating: "",
    date: "",
  }); // Store filter values
  const [sort, setSort] = useState({ field: "date", order: "asc" }); // Store sort values
  const [validationError, setValidationError] = useState(""); // Validation error message

  // Fetch activities from the backend
  const fetchActivities = async () => {
    try {
      const response = await getAllActivities();
      setActivities(response.data.activities); // Set activities data
      setOriginalActivities(response.data.activities); // Store the original activities
      setLoading(false);
    } catch (error) {
      setError("Error fetching activities");
      setLoading(false);
    }
  };

  // Fetch categories for the dropdown
  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data.categories); // Set categories data
    } catch (error) {
      setError("Error fetching categories");
    }
  };

  // Handle category checkbox change
  const handleCategoryChange = (categoryId) => {
    setFilters((prevFilters) => {
      const { selectedCategories } = prevFilters;
      if (selectedCategories.includes(categoryId)) {
        return {
          ...prevFilters,
          selectedCategories: selectedCategories.filter((id) => id !== categoryId),
        };
      } else {
        return {
          ...prevFilters,
          selectedCategories: [...selectedCategories, categoryId],
        };
      }
    });
  };

  // Validate filter inputs
  const validateFilters = () => {
    if (!filters.budget && !filters.selectedCategories.length && !filters.rating && !filters.date) {
      setValidationError("Please fill at least one filter field.");
      return false;
    }
    setValidationError(""); // Clear error message if validation passes
    return true;
  };

  // Handle filter submission (all filtering logic on frontend)
  const handleFilter = () => {
    if (!validateFilters()) return; // Only proceed if validation passes

    let filteredActivities = [...originalActivities]; // Always filter from the original list

    // Filter by category
    if (filters.selectedCategories.length > 0) {
      filteredActivities = filteredActivities.filter((activity) => filters.selectedCategories.includes(activity.category._id));
    }

    // Filter by budget
    if (filters.budget) {
      filteredActivities = filteredActivities.filter((activity) => activity.price <= parseFloat(filters.budget));
    }

    // Filter by rating
    if (filters.rating) {
      filteredActivities = filteredActivities.filter((activity) => {
        const activityRating = parseFloat(activity.rating) || 0;
        return activityRating === parseFloat(filters.rating);
      });
    }

    // Filter by date
    if (filters.date) {
      filteredActivities = filteredActivities.filter((activity) => {
        const activityDate = new Date(activity.date).toISOString().split("T")[0];
        return activityDate === filters.date;
      });
    }

    setActivities(filteredActivities); // Set filtered activities
  };

  // Sorting logic
  const handleSort = () => {
    let sortedActivities = [...activities]; // Create a copy of activities

    // Sorting logic
    sortedActivities.sort((a, b) => {
      if (sort.field === "date") {
        return sort.order === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sort.field === "price") {
        return sort.order === "asc" ? a.price - b.price : b.price - a.price;
      } else {
        return 0; // Default case, no sorting applied
      }
    });

    setActivities(sortedActivities); // Set sorted activities
  };

  // Reset filters and fetch all activities again
  const handleResetFilters = () => {
    setFilters({ budget: "", selectedCategories: [], rating: "", date: "" }); // Reset filter values
    setValidationError(""); // Clear validation error
    setActivities(originalActivities); // Reset activities to original list
  };

  // useEffect to call fetchActivities and fetchCategories when component mounts
  useEffect(() => {
    fetchActivities();
    fetchCategories();
  }, []);

  if (loading) {
    return <p style={styles.loading}>Loading...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Upcoming Activities</h2>

      {/* Sort Dropdown */}
      <div style={styles.sortContainer}>
        <label style={styles.label}>
          Sort by:
          <select
            value={sort.field}
            onChange={(e) => setSort({ ...sort, field: e.target.value })}
            style={styles.select}
          >
            <option value="date">Date</option>
            <option value="price">Price</option>
          </select>
        </label>
        <label style={styles.label}>
          Order:
          <select
            value={sort.order}
            onChange={(e) => setSort({ ...sort, order: e.target.value })}
            style={styles.select}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        {/* Sort Button */}
        <button onClick={handleSort} style={styles.button}>
          Sort
        </button>
      </div>

      <div style={styles.filterContainer}>
        <h4>Filter by Category:</h4>
        <div style={styles.checkboxContainer}>
          {categories.map((category) => (
            <label key={category._id} style={styles.checkboxLabel}>
              <input
                type="checkbox"
                value={category._id}
                checked={filters.selectedCategories.includes(category._id)}
                onChange={() => handleCategoryChange(category._id)}
              />
              {category.name}
            </label>
          ))}
        </div>

        <input
          type="number"
          placeholder="Budget"
          min="0"
          value={filters.budget}
          onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Rating (1-5)"
          value={filters.rating}
          min="1"
          max="5"
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          style={styles.input}
        />

        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          style={styles.input}
        />

        <button onClick={handleFilter} style={styles.button}>
          Filter
        </button>
        <button onClick={handleResetFilters} style={styles.button}>
          Reset Filters
        </button>
      </div>
      {validationError && <p style={styles.error}>{validationError}</p>} {/* Display validation error */}
      {activities.length === 0 ? (
        <p style={styles.noActivities}>No upcoming activities available.</p>
      ) : (
        <div style={styles.grid}>
          {activities.map((activity) => (
            <div key={activity._id} style={styles.card}>
              <h3 style={styles.cardHeading}>{activity.name}</h3>
              <p>
                <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {activity.time}
              </p>
              <p>
                <strong>Category:</strong> {activity.category.name}
              </p>
              <p>
                <strong>Tags:</strong> {activity.tags.length > 0 ? activity.tags.map((tag) => tag.name).join(", ") : "No tags available"}
              </p>
              <p>
                <strong>Price:</strong> ${activity.price}
              </p>
              <p>
                <strong>Duration:</strong> {activity.duration} mins
              </p>
              <p>
                <strong>Rating:</strong> {activity.rating || "No ratings yet"}
              </p>
              <p>
                <strong>Discount:</strong> {activity.specialDiscount}%
              </p>
              <p>
                <strong>Location:</strong> {activity.location}
              </p>
              <p>
                <strong>Bookable:</strong> {activity.isBookable ? "Yes" : "No"}
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
  sortContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
  },
  input: {
    marginRight: "10px",
    padding: "5px",
    width: "100px",
  },
  select: {
    marginRight: "10px",
    padding: "5px",
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

export default AllActivities;
