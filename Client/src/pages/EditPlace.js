import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditPlace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState({
    name: "",
    description: "",
    pictures: [],
    location: {
      address: "",
      city: "",
      country: "",
    },
    openingHours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    ticketPrices: {
      foreigner: "",
      native: "",
      student: "",
    },
    type: "",
    historicalPeriod: "",
  });

  const [newPicture, setNewPicture] = useState("");

  // Fetch place data to edit
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/governor/${id}`)
      .then((response) => {
        setPlace(response.data.data.place);
      });
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlace((prevPlace) => ({
      ...prevPlace,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`${process.env.REACT_APP_API_BASE_URL}/governor/${id}`, place)
      .then((response) => {
        console.log("Place updated:", response.data);
        // Redirect after successful update
        navigate(`/governor/${id}`);
      })
      .catch((err) => {
        console.error("Error updating place:", err);
      });
  };

  // Handle adding new picture
  const handleAddPicture = () => {
    setPlace((prevPlace) => ({
      ...prevPlace,
      pictures: [...prevPlace.pictures, newPicture],
    }));
    setNewPicture(""); // Clear input after adding
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Place</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={place.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={place.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Location */}
        <div>
          <label>Address</label>
          <input
            type="text"
            name="location.address"
            value={place.location.address}
            onChange={(e) =>
              setPlace({
                ...place,
                location: { ...place.location, address: e.target.value },
              })
            }
            required
          />
          <label>City</label>
          <input
            type="text"
            name="location.city"
            value={place.location.city}
            onChange={(e) =>
              setPlace({
                ...place,
                location: { ...place.location, city: e.target.value },
              })
            }
            required
          />
          <label>Country</label>
          <input
            type="text"
            name="location.country"
            value={place.location.country}
            onChange={(e) =>
              setPlace({
                ...place,
                location: { ...place.location, country: e.target.value },
              })
            }
            required
          />
        </div>

        {/* Opening Hours */}
        <div>
          <h3>Opening Hours</h3>
          {Object.keys(place.openingHours).map((day) => (
            <div key={day}>
              <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
              <input
                type="text"
                name={`openingHours.${day}`}
                value={place.openingHours[day]}
                onChange={(e) =>
                  setPlace({
                    ...place,
                    openingHours: {
                      ...place.openingHours,
                      [day]: e.target.value,
                    },
                  })
                }
              />
            </div>
          ))}
        </div>

        {/* Ticket Prices */}
        <div>
          <h3>Ticket Prices</h3>
          <label>Foreigner Ticket</label>
          <input
            type="number"
            name="ticketPrices.foreigner"
            value={place.ticketPrices.foreigner}
            onChange={(e) =>
              setPlace({
                ...place,
                ticketPrices: {
                  ...place.ticketPrices,
                  foreigner: e.target.value,
                },
              })
            }
          />
          <label>Native Ticket</label>
          <input
            type="number"
            name="ticketPrices.native"
            value={place.ticketPrices.native}
            onChange={(e) =>
              setPlace({
                ...place,
                ticketPrices: { ...place.ticketPrices, native: e.target.value },
              })
            }
          />
          <label>Student Ticket</label>
          <input
            type="number"
            name="ticketPrices.student"
            value={place.ticketPrices.student}
            onChange={(e) =>
              setPlace({
                ...place,
                ticketPrices: { ...place.ticketPrices, student: e.target.value },
              })
            }
          />
        </div>

        {/* Add Pictures */}
        <div>
          <h3>Pictures</h3>
          <ul>
            {place.pictures.map((pic, index) => (
              <li key={index}>
                <img src={pic} alt={`pic-${index}`} style={{ width: "100px" }} />
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newPicture}
            onChange={(e) => setNewPicture(e.target.value)}
            placeholder="Add new picture URL"
          />
          <button type="button" onClick={handleAddPicture}>
            Add Picture
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit">Submit Changes</button>
      </form>
    </div>
  );
}

export default EditPlace;
