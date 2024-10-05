import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PlacesList() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    fetchPlaces();
  }, []);
  const fetchPlaces = async () => {
   
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/governor/getAllPlaces`);
      setPlaces(response.data.data.places);
      console.log(response.data.data.places);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };
 

 

  // Render the filters
  return (
    <div style={{ padding: "20px" }}>
      
      {places.map((place) => (
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
          {/* <button onClick={() => deletefun(place._id)}>Delete Place</button> */}
          <Link to={`/governor/edit/${place._id}`}>
            <button style={{ marginTop: "20px" }}>Edit Place</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default PlacesList;
