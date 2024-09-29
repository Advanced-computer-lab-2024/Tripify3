import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function PlacesList() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/governor/getAllPlaces`).then((response) => {
      setPlaces(response.data.data.places);
    });
  }, []);
  const deletefun = (id)=>{
    axios.delete(`${process.env.REACT_APP_API_BASE_URL}/governor/${id}`).then((response) => {
      console.log(response.data); 
      setPlaces(places.filter((place) => place._id !== id));
      // Check the backend response
    })
    .catch((e) => {
      console.error("Error submitting form:", e);
      console.log(error)
    });
  }
  
  return (
    <div style={{ padding: "20px" }}>
      {places.map((place) => (
        <div key={place._id} style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "10px" }}>
          <h2>{place.name}</h2>
          <p>{place.description}</p>
          <Link to={`/governor/${place._id}`}>View Details</Link>
          <button onClick={() => deletefun(place._id)}>Delete Place</button>
        </div>
      ))}
    </div>
  );
};

export default PlacesList;
