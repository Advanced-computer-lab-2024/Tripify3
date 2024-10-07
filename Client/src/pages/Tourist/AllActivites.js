import React, { useState, useEffect } from "react";
import {
  getAllActivities,
  getAllCategories,
  filterActivities,
} from "../../services/tourist.js"; // Import the API function

const AllActivities = () => {
  const [activities, setActivities] = useState([]); // Store the activities
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [categories, setCategories] = useState([]); // Store categories
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    category: "",
    rating: "",
  }); // Store filter values
  const [validationError, setValidationError] = useState(""); // Validation error message
  const [sortCriteria, setSortCriteria] = useState({
    attribute: "",
    order: "",
  }); // Store sort criteria

  // Fetch activities from the backend
  const fetchActivities = async () => {
    try {
      const response = await getAllActivities();
      setActivities(response.data.activities); // Set activities data
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

  // Validate filter inputs
  const validateFilters = () => {
    const minPrice = parseFloat(filters.minPrice);
    const maxPrice = parseFloat(filters.maxPrice);

    if (maxPrice < minPrice) {
      setValidationError("Max Price must be greater than Min Price.");
      return false;
    }
    setValidationError(""); // Clear error message if validation passes
    return true;
  };

  // Handle filter submission
  const handleFilter = async () => {
    if (
      !filters.minPrice &&
      !filters.maxPrice &&
      !filters.category &&
      !filters.rating
    ) {
      setValidationError("Please fill at least one filter field.");
      return; // Do not proceed if all fields are empty
    }

    if (!validateFilters()) return; // Only proceed if validation passes

    try {
      const response = await filterActivities({
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        category: filters.category,
        rating: filters.rating,
      });
      setActivities(response.data.activities); // Set filtered activities
    } catch (error) {
      setError("Error fetching filtered activities");
    }
  };

  // Reset filters and fetch all activities again
  const handleResetFilters = () => {
    setFilters({ minPrice: "", maxPrice: "", category: "", rating: "" }); // Reset filter values
    setValidationError(""); // Clear validation error
    fetchActivities(); // Fetch all activities
  };

  // Sorting functionality
  const handleSort = () => {
    let sortedActivities = [...activities];
    if (sortCriteria.attribute && sortCriteria.order) {
      sortedActivities.sort((a, b) => {
        const aValue = a[sortCriteria.attribute];
        const bValue = b[sortCriteria.attribute];

        if (sortCriteria.order === "ascen") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else if (sortCriteria.order === "desc") {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
        return 0;
      });
      setActivities(sortedActivities); // Update activities with sorted data
    }
  };

  // Reset sorting to the original activities
  const handleResetSort = () => {
    fetchActivities(); // Fetch all activities again to reset sorting
    setSortCriteria({ attribute: "", order: "" }); // Reset sort criteria
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
      <div style={styles.sortContainer}>
        <select
          value={sortCriteria.attribute}
          onChange={(e) =>
            setSortCriteria({ ...sortCriteria, attribute: e.target.value })
          }
          style={styles.select}
        >
          <option value="">Sort by</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
        <select
          value={sortCriteria.order}
          onChange={(e) =>
            setSortCriteria({ ...sortCriteria, order: e.target.value })
          }
          style={styles.select}
        >
          <option value="">Order</option>
          <option value="ascen">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button onClick={handleSort} style={styles.button}>
          Sort
        </button>
        <button onClick={handleResetSort} style={styles.button}>
          Reset Sort
        </button>
      </div>
      <div style={styles.filterContainer}>
        <input
          type="number"
          placeholder="Min Price"
          min="0"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          style={styles.input}
        />
        <input
          type="number"
          placeholder="Max Price"
          min="0"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          style={styles.input}
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          style={styles.select}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          style={styles.input}
        />
        <button onClick={handleFilter} style={styles.button}>
          Filter
        </button>
        <button onClick={handleResetFilters} style={styles.button}>
          Reset Filters
        </button>
      </div>
      {validationError && <p style={styles.error}>{validationError}</p>}{" "}
      {/* Display validation error */}
      {activities.length === 0 ? (
        <p style={styles.noActivities}>No upcoming activities available.</p>
      ) : (
        <div style={styles.grid}>
          {activities.map((activity) => (
            <div key={activity._id} style={styles.card}>
              <h3 style={styles.cardHeading}>{activity.name}</h3>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(activity.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {activity.time}
              </p>
              <p>
                <strong>Category:</strong> {activity.category.name}
              </p>
              <p>
                <strong>Tags:</strong>{" "}
                {activity.tags.length > 0
                  ? activity.tags.map((tag) => tag.name).join(", ")
                  : "No tags available"}
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
                <strong>Bookable:</strong> {activity.isBooking ? "Yes" : "No"}
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
