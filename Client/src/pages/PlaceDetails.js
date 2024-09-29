import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function PlaceDetails() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/governor/${id}`).then((response) => {
      setPlace(response.data.data.place);
      console.log(response.data.data.place);
    });
  }, [id]);

  if (!place) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{place.name}</h2>
      <img 
        
        alt={place.name} 
        style={{ width: "100%", height: "300px", objectFit: "cover" }} 
      />
      <p>{place.description}</p>
      <h3>Ticket Prices:</h3>
      <ul>
        <li>Foreigner: ${place.ticketPrices.foreigner}</li>
        <li>Native: ${place.ticketPrices.native}</li>
        <li>Student: ${place.ticketPrices.student}</li>
      </ul>
    </div>
  );
}

export default PlaceDetails;
