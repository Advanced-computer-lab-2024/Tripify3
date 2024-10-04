import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PlacesList() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [historicalPeriod, setHistoricalPeriod] = useState("");
  const [historicalPeriodOperator, setHistoricalPeriodOperator] =
    useState("gte"); // Default operator
  const [type, setType] = useState("");

  useEffect(() => {
    fetchPlaces();
  }, []);
  const fetchPlaces = async () => {
    // Build query params based on filters
    const params = {};
    if (historicalPeriod) {
      params[`historicalPeriod[${historicalPeriodOperator}]`] =
        historicalPeriod; // Use the operator as part of the key
    }
    if (type) {
      params.type = type;
    }

    try {
      console.log("aloo");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/governor/getAllPlaces`,
        { params }
      );
      setFilteredPlaces(response.data.data.places);
      console.log(response.data.data.places);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };
  const deletefun = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/governor/${id}`)
      .then((response) => {
        console.log(response.data);
        setPlaces(places.filter((place) => place._id !== id));
        setFilteredPlaces(filteredPlaces.filter((place) => place._id !== id)); // Update filtered places
      })
      .catch((e) => {
        console.error("Error deleting place:", e);
      });
  };

  // Handle filtering
  const handleFilter = (e) => {
    e.preventDefault();
    fetchPlaces();
  };

  // Render the filters
  return (
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleFilter}>
        <div>
          <label>Historical Period:</label>
          <select
            value={historicalPeriodOperator}
            onChange={(e) => setHistoricalPeriodOperator(e.target.value)}
          >
            <option value="gte">Greater than or equal to</option>
            <option value="gt">Greater than</option>
            <option value="lte">Less than or equal to</option>
            <option value="lt">Less than</option>
            <option value="">Equal to</option>
          </select>
          <input
            type="number"
            value={historicalPeriod}
            onChange={(e) => setHistoricalPeriod(e.target.value)}
            placeholder="Enter historical period"
          />
        </div>
        <div>
          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Monument">Monument</option>
            <option value="Religious Site">Religious Site</option>
            <option value="Palace/Castle">Palace/Castle</option>
            <option value="Museum">Museum</option>
            <option value="Historical Place">Historical Place</option>
          </select>
        </div>
        <button type="submit">Filter</button>
      </form>
      {filteredPlaces.map((place) => (
        <div
          key={place._id}
          style={{
            marginBottom: "20px",
            border: "1px solid #ddd",
            padding: "10px",
          }}
        >
          <h2>{place.name}</h2>
          <p>{place.description}</p>
          <Link to={`/governor/${place._id}`}>View Details</Link>
          <button onClick={() => deletefun(place._id)}>Delete Place</button>
          <Link to={`/governor/edit/${place._id}`}>
            <button style={{ marginTop: "20px" }}>Edit Place</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default PlacesList;
