import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PlacesList() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/governor/getAllPlaces`).then((response) => {
      setPlaces(response.data.data.places);
      console.log();
    });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {places.map((place) => (
        <div key={place._id} style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "10px" }}>
          <h1>{place._id}</h1>
          <h2>{place.name}</h2>
          <img 
            src={place.pictures[0]} 
            alt={place.name} 
            style={{ width: "100%", height: "200px", objectFit: "cover" }} 
          />
          <p>{place.description}</p>
          <Link to={`/place/${place._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

export default PlacesList;
