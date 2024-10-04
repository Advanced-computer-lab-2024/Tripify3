import React, { useState, useEffect } from "react";
import axios from "axios";

const PlaceForm = () => {
  // State for each field in the place schema
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pictures, setPictures] = useState([""]);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState(null);

  const [openingHours, setOpeningHours] = useState({
    friday: "",
    saturday: "",
    sunday: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
  });

  const [ticketPrices, setTicketPrices] = useState({
    foreigner: "",
    native: "",
    student: "",
  });

  const [type, setType] = useState("");
  const [historicalPeriod, setHistoricalPeriod] = useState("");

  // Handler functions for form submission, inputs, etc.

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object that matches the schema structure
    const newPlace = {
      name,
      description,
      pictures,
      location: {
        address,
        city,
        country,
      },
      openingHours,
      ticketPrices,
      type,
      historicalPeriod,
    };
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/governor/addPlace`, newPlace)
      .then((response) => {
        console.log(response.data); // Check the backend response
        setError("Successfully added"); // Clear error if successful
      })
      .catch((e) => {
        console.error("Error submitting form:", e);
        setError(e.response.data.message.message); // Set error if failed
        console.log(error);
      });
  };
  return (
    <div className="form-container">
      <h2>Add New Place</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Place Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter place name"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>
        <div className="form-group">
          <label>Picture URL</label>
          <input
            type="text"
            value={pictures[0]}
            onChange={(e) => setPictures([e.target.value])}
            placeholder="Enter picture URL"
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
          />
        </div>
        <div className="form-group">
          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter country"
          />
        </div>
        <div className="form-group">
          <label>Monday Hours</label>
          <input
            type="text"
            value={openingHours.monday}
            onChange={(e) =>
              setOpeningHours({ ...openingHours, monday: e.target.value })
            }
            placeholder="Opening hours for Monday"
          />
        </div>
        <div className="form-group">
          <label>Tuesday Hours</label>
          <input
            type="text"
            value={openingHours.tuesday}
            onChange={(e) =>
              setOpeningHours({ ...openingHours, tuesday: e.target.value })
            }
            placeholder="Opening hours for Tuesday"
          />
        </div>
        <div className="form-group">
          <label>Wednesday Hours</label>
          <input
            type="text"
            value={openingHours.wednesday}
            onChange={(e) =>
              setOpeningHours({ ...openingHours, wednesday: e.target.value })
            }
            placeholder="Opening hours for Wednesday"
          />
        </div>
        <div className="form-group">
          <label>Thursday Hours</label>
          <input
            type="text"
            value={openingHours.thursday}
            onChange={(e) =>
              setOpeningHours({ ...openingHours, thursday: e.target.value })
            }
            placeholder="Opening hours for Thursday"
          />
        </div>
        <div className="form-group">
          <label>Friday Hours</label>
          <input
            type="text"
            value={openingHours.friday}
            onChange={(e) =>
              setOpeningHours({ ...openingHours, friday: e.target.value })
            }
            placeholder="Opening hours for Friday"
          />
        </div>
        <div className="form-group">
          <label>Saturday Hours</label>
          <input
            type="text"
            value={openingHours.saturday}
            onChange={(e) =>
              setOpeningHours({ ...openingHours, saturday: e.target.value })
            }
            placeholder="Opening hours for Saturday"
          />
        </div>
        <div className="form-group">
          <label>Sunday Hours</label>
          <input
            type="text"
            value={openingHours.sunday}
            onChange={(e) =>
              setOpeningHours({ ...openingHours, sunday: e.target.value })
            }
            placeholder="Opening hours for Sunday"
          />
        </div>
        <div className="form-group">
          <label>Foreigner Ticket Price</label>
          <input
            type="number"
            value={ticketPrices.foreigner}
            onChange={(e) =>
              setTicketPrices({ ...ticketPrices, foreigner: e.target.value })
            }
            placeholder="Enter foreigner price"
          />
        </div>
        <div className="form-group">
          <label>Native Ticket Price</label>
          <input
            type="number"
            value={ticketPrices.native}
            onChange={(e) =>
              setTicketPrices({ ...ticketPrices, native: e.target.value })
            }
            placeholder="Enter native price"
          />
        </div>{" "}
        <div className="form-group">
          <label>Student Ticket Price</label>
          <input
            type="number"
            value={ticketPrices.student}
            onChange={(e) =>
              setTicketPrices({ ...ticketPrices, student: e.target.value })
            }
            placeholder="Enter student price"
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Type</option> {/* Default option */}
            <option value="Monument">Monument</option>
            <option value="Religious Site">Religious Site</option>
            <option value="Palace/Castle">Palace/Castle</option>
            <option value="Museum">Museum</option>
            <option value="Historical Place">Historical Place</option>
          </select>
        </div>
        <div className="form-group">
          <label>Historical Period</label>
          <input
            type="number"
            value={historicalPeriod}
            onChange={(e) => setHistoricalPeriod(e.target.value)}
            placeholder="Enter historical period"
          />
        </div>
        <div className="error-popup">
          <p>{error}</p>
        </div>
        <button type="submit" className="submit-btn">
          Add Place
        </button>
      </form>
    </div>
  );
};

export default PlaceForm;
