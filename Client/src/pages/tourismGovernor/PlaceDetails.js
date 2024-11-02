import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/governor/place/get/${id}`)
      .then((response) => {
        // Adjust to access the right place from the response structure
        const places = response.data.data.place;
        // const placeDetails = places.find(place => place._id === id); // find the specific place by id
        setPlace(places);
        console.log(places);
      })
      .catch((error) => {
        console.error("Error fetching place details:", error);
      });
  }, [id]);

  const deletefun = (id) => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/governor/${id}`)
      .then((response) => {
        console.log(response.data);
        navigate("/governor/placeslist");
      })
      .catch((e) => {
        console.error("Error deleting place:", e);
      });
  };

  if (!place) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      {/* Place Name */}
      <h2>{place.name}</h2>
      <p><strong>Type:</strong> {place.type}</p>

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
        {place.openingHours.length > 0 ? (
          place.openingHours.map((hour) => (
            <li key={hour._id}>
              {hour.day}: {hour.from} - {hour.to}
            </li>
          ))
        ) : (
          <li>Closed</li>
        )}
      </ul>

      {/* Tags */}
      <h3>Tags:</h3>
      <p>
        {place.tags.length > 0 ? (
          place.tags.map((tags) => (
            <span key={tags._id} style={{ marginRight: "10px", fontWeight: "bold" }}>
              {tags.name}
            </span>
          ))
        ) : (
          <span>No tags available</span>
        )}
      </p>

      <Link to={`/governor/edit/${place._id}`}>
        <button style={{ marginTop: "20px" }}>Edit Place</button>
      </Link>
      <Link to={`/governor`}>
        <button style={{ marginTop: "20px" }}>All Places</button>
      </Link>

    </div>
  );
}

export default PlaceDetails;
