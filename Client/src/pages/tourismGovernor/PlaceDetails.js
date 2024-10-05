import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams,Link } from "react-router-dom";

function PlaceDetails() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/governor/${id}`)
      .then((response) => {
        setPlace(response.data.data.place);
        console.log(response.data.data.place);
      });
  }, [id]);
  if (!place) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      {/* Place Name */}
      <h2>{place.name}</h2>

      {/* Images */}
      <div>
        {place.pictures.map((picture, index) => (
          <img
            key={index}
            src={picture}
            alt={place.name}
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              marginBottom: "20px",
            }}
          />
        ))}
      </div>

      {/* Description */}
      <p>{place.description}</p>

      {/* Ticket Prices */}
      <h3>Ticket Prices:</h3>
      <ul>
        <li>Foreigner: ${place.ticketPrices.foreigner}</li>
        <li>Native: ${place.ticketPrices.native}</li>
        <li>Student: ${place.ticketPrices.student}</li>
      </ul>

      {/* Location */}
      <h3>Location:</h3>
      <p>
        <strong>Address:</strong> {place.location.address}
        <br />
        <strong>City:</strong> {place.location.city}
        <br />
        <strong>Country:</strong> {place.location.country}
      </p>

      {/* Opening Hours */}
      <h3>Opening Hours:</h3>
      <ul>
        <li>Monday: {place.openingHours.monday || "Closed"}</li>
        <li>Tuesday: {place.openingHours.tuesday || "Closed"}</li>
        <li>Wednesday: {place.openingHours.wednesday || "Closed"}</li>
        <li>Thursday: {place.openingHours.thursday || "Closed"}</li>
        <li>Friday: {place.openingHours.friday || "Closed"}</li>
        <li>Saturday: {place.openingHours.saturday || "Closed"}</li>
        <li>Sunday: {place.openingHours.sunday || "Closed"}</li>
      </ul>

      {/* Type and Historical Period */}
      <h3>Details:</h3>
      <p>
        <strong>Type:</strong> {place.type}
        <br />
        <strong>Historical Period:</strong> {place.historicalPeriod}
      </p>
      <Link to={`/governor/edit/${place._id}`}>
        <button style={{ marginTop: "20px" }}>Edit Place</button>
      </Link>
    </div>
  );
}

export default PlaceDetails;
