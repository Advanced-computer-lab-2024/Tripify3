import React, { useState, useEffect } from "react";
import { getUserProfile } from "../../services/tourist";
import { getUserId, getUserType, setTouristData } from "../../utils/authUtils"; ///////////////////////
import { useParams, useNavigate } from "react-router-dom"; ////////////////////////

import axios from "axios";
import DatePicker from "react-datepicker";
import { FaTaxi, FaCar, FaMotorcycle, FaSearch, FaMapMarkerAlt, FaClock, FaCheckCircle, FaSpinner } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Transportation = () => {
  const [source, setSource] = useState("");
  const { id } = useParams(); /////////
  const userId = getUserId();
  const [currency, setCurrency] = useState("USD"); // Default currency///////////////

  const [destination, setDestination] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [pickupTime, setPickupTime] = useState(new Date());
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [transportType, setTransportType] = useState("taxi");
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(userId);
        setCurrency(response.data.userProfile.currency); // Set user's selected currency
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();

    if (directionsResponse && directionsResponse.distanceInKm !== null) {
      const calculatedPrice =
        transportType === "scooter"
          ? Math.ceil(directionsResponse.distanceInKm * 3.5)
          : transportType === "luxary"
          ? Math.ceil(directionsResponse.distanceInKm * 12.5)
          : transportType === "taxi"
          ? Math.ceil(directionsResponse.distanceInKm * 6)
          : Math.ceil(directionsResponse.distanceInKm); // Default price if no transport type

      setPrice(calculatedPrice); // Set price in state
    } else {
      setPrice(0); // Set price to 0 if directionsResponse is null or undefined
    }
  }, [transportType, directionsResponse, id, userId]);

  const handleBooking = async () => {
    // Retrieve userId (tourist) from local storage
    // const userId = localStorage.getItem("userId");
    // if (!userId) {
    //   alert("User not found in local storage");
    //   return;
    // }

    // Prepare booking details as a string (formatted)
    const details = `Source: ${source}, Destination: ${destination},Price: ${price}, Pickup Time: ${pickupTime.toLocaleString()}, Transport Type: ${transportType}`;

    // Set the price (this should already be calculated from your previous logic)
    const calculatedPrice = price; // Make sure price state is set correctly earlier

    // const booking = { tourist: userId, price: calculatedPrice, type: "Transportation", details: details };

    navigate(`/tourist/payment/${calculatedPrice}/Transportation/${null}/${null}/${null}/${null}/${null}/${null}`);
 
    // setTouristData(booking);
    // try {
    //   // Show loading indicator
    //   setLoading(true);
    //   setShowModal(true); // Show modal

    //   // Send POST request to your API
    //   const response = await axios.post("http://localhost:8000/tourist/booking/create", {
    //     tourist: userId,
    //     price: calculatedPrice,
    //     type: "Transportation",
    //     details,
    //   });

    //   // Handle successful booking response
    //   setBookingSuccess(true); // Set booking success
    // } catch (error) {
    //   // Handle errors (e.g., network issues)
    //   console.error("Error booking:", error);
    //   setBookingSuccess(false);
    // } finally {
    //   // Hide loading indicator
    //   setLoading(false);
    // }
  };
  const exchangeRates = {
    USD: 1 / 49, // 1 EGP = 0.0204 USD (1 USD = 49 EGP)
    EUR: 1 / 52, // 1 EGP = 0.0192 EUR (1 EUR = 52 EGP)
    GBP: 1 / 63, // 1 EGP = 0.0159 GBP (1 GBP = 63 EGP)
    AUD: 1 / 32, // 1 EGP = 0.03125 AUD (1 AUD = 32 EGP)
    CAD: 1 / 35, // 1 EGP = 0.02857 CAD (1 CAD = 35 EGP)
    // Add other currencies as needed
  };

  const formatCurrency = (amount) => {
    if (!currency) {
      return amount; // Fallback to amount if currency is not set
    }
    // Ensure amount is a number
    const value = Number(amount);

    // Check user type and apply currency logic
    if (getUserType() !== "Tourist") {
      // If user is not Tourist, format amount in EGP
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
      }).format(value);
    }

    // Convert amount from EGP to chosen currency if currency is EGP
    const convertedAmount = currency === "EGP" ? value : value * exchangeRates[currency];

    // return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency })
    //   .format(convertedAmount);

    const formattedAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(convertedAmount);

    return formattedAmount.replace(/(\D)(\d)/, "$1 $2");
  };

  const fetchSuggestions = async (place, setSuggestions) => {
    if (place.trim() === "") {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/suggestions?city=Cairo&place=${place}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };
  // Render a suggestion item in the dropdown
  const renderSuggestion = (suggestion, handleSelect) => (
    <div
      style={styles.suggestionItem}
      key={suggestion.value}
      onClick={() => handleSelect(suggestion)}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <FaMapMarkerAlt style={styles.suggestionIcon} />
      <div style={styles.suggestionText}>
        <strong>{suggestion.value}</strong>
        <span style={styles.suggestionSubtext}>{suggestion.subtext}</span>
      </div>
    </div>
  );

  // Handle input changes and fetch suggestions
  const handleInputChange = (e, setSourceOrDestination, fetchSuggestionsFunc, setSuggestions) => {
    const value = e.target.value;
    setSourceOrDestination(value);
    if (e.target.value.length >= 3) {
      fetchSuggestionsFunc(value, setSuggestions);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion, setSourceOrDestination) => {
    setSourceOrDestination(suggestion.value + "," + suggestion.subtext); // Set selected suggestion value
    setSourceSuggestions([]);
    setDestinationSuggestions([]);
  };

  const handleSchedule = async () => {
    setLoading(true);
    setSourceSuggestions([]);
    setDestinationSuggestions([]);
    try {
      const response = await axios.get(`http://localhost:8000/directions?src=${source}&dest=${destination}`);
      setDirectionsResponse(response.data);
    } catch (error) {
      console.error("Error fetching directions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (directionsResponse) {
      const { latitude: startLat, longitude: startLng } = directionsResponse.detials[0].gps_coordinates;
      const { latitude: endLat, longitude: endLng } = directionsResponse.detials[1].gps_coordinates;

      const map = L.map("map");

      const bounds = L.latLngBounds([startLat, startLng], [endLat, endLng]);
      map.fitBounds(bounds);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const startMarker = L.marker([startLat, startLng]).addTo(map);
      const endMarker = L.marker([endLat, endLng]).addTo(map);

      L.polyline(
        [
          [startLat, startLng],
          [endLat, endLng],
        ],
        { color: "blue" }
      ).addTo(map);

      return () => map.remove();
    }
  }, [directionsResponse]);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formContainer}>
        {/* Source Input with Icon */}
        <div style={styles.inputSection}>
          <label style={styles.label}>
            <FaMapMarkerAlt style={styles.labelIcon} /> Source
          </label>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={source}
              onChange={(e) => handleInputChange(e, setSource, fetchSuggestions, setSourceSuggestions)}
              onClick={() => {
                setDestinationSuggestions([]);
              }}
              placeholder="Enter source address"
              style={styles.inputField}
            />
            {source && sourceSuggestions.length > 0 && (
              <div style={styles.suggestionsDropdown}>
                {sourceSuggestions.map((suggestion) => renderSuggestion(suggestion, () => handleSelectSuggestion(suggestion, setSource, setSourceSuggestions)))}
              </div>
            )}
          </div>
        </div>

        {/* Destination Input with Suggestions Dropdown */}
        <div style={styles.inputSection}>
          <label style={styles.label}>
            <FaMapMarkerAlt style={styles.labelIcon} /> Destination
          </label>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={destination}
              onChange={(e) => handleInputChange(e, setDestination, fetchSuggestions, setDestinationSuggestions)}
              onClick={() => {
                setSourceSuggestions([]);
              }}
              placeholder="Enter destination address"
              style={styles.inputField}
            />
            {destination && destinationSuggestions.length > 0 && (
              <div style={styles.suggestionsDropdown}>
                {destinationSuggestions.map((suggestion) => renderSuggestion(suggestion, () => handleSelectSuggestion(suggestion, setDestination, setDestinationSuggestions)))}
              </div>
            )}
          </div>
        </div>

        {/* Transport Type Selection with Icons */}
        <div
          onClick={() => {
            setSourceSuggestions([]), setDestinationSuggestions([]);
          }}
          style={{ ...styles.inputSection, marginLeft: "20px" }}
        >
          <label style={styles.label}>Transport Type</label>
          <div style={styles.iconGroup}>
            <div onClick={() => setTransportType("taxi")} style={styles.iconWrapper(transportType === "taxi")}>
              <FaTaxi style={styles.icon} />
              <span style={styles.iconLabel(transportType === "taxi")}>Taxi</span>
            </div>
            <div onClick={() => setTransportType("luxary")} style={styles.iconWrapper(transportType === "luxary")}>
              <FaCar style={styles.icon} />
              <span style={styles.iconLabel(transportType === "luxary")}>Luxary Car</span>
            </div>
            <div onClick={() => setTransportType("scooter")} style={styles.iconWrapper(transportType === "scooter")}>
              <FaMotorcycle style={styles.icon} /> {/* Updated icon */}
              <span style={styles.iconLabel(transportType === "scooter")}>Motorcycle</span>
            </div>
          </div>
        </div>

        {/* Date Picker for Pickup Time with Clock Icon */}
        <div
          onClick={() => {
            setSourceSuggestions([]), setDestinationSuggestions([]);
          }}
          style={styles.inputSection}
        >
          <label style={styles.label}>
            <FaClock style={styles.labelIcon} /> Pickup Time
          </label>
          <div style={styles.datePickerContainer}>
            <DatePicker
              selected={pickupTime}
              onChange={(date) => setPickupTime(date)}
              showTimeSelect
              dateFormat="Pp"
              placeholderText="Select Pickup Time"
              minDate={new Date()} // Prevent selecting past dates
              minTime={
                // If the selected day is today, set minTime to the current time
                pickupTime instanceof Date && pickupTime.toDateString() === new Date().toDateString()
                  ? new Date(new Date().setSeconds(0, 0)) // Current time today
                  : new Date(new Date().setHours(0, 0, 0, 0)) // For future days, set minTime to 12:00 AM
              }
              maxTime={new Date(new Date().setHours(23, 59, 59))} // Set max time to the end of the day
              style={styles.datePicker}
              timeIntervals={1} // 1-minute intervals
              filterTime={(time) => {
                // Disallow past times, considering both date and time
                const now = new Date();
                const currentTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());
                const selectedTime = new Date(time);
                return selectedTime >= currentTime; // Only allow times in the future
              }}
            />
          </div>
        </div>
      </div>

      <button onClick={handleSchedule} style={styles.scheduleButton}>
        <FaSearch /> Schedule
      </button>

      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingMessage}>Loading route...</div>
        </div>
      )}

      {directionsResponse && (
        <div style={styles.mapAndInfoContainer}>
          <div style={styles.mapContainer}>
            <div id="map" style={styles.map}></div>
          </div>

          <div style={styles.tripOverview}>
            <div style={styles.tripDetailContainer}>
              {/* Distance */}
              <div style={styles.tripDetail}>
                <div style={styles.tripDetailTitle}>Distance</div>
                <div style={styles.infoBox}>{directionsResponse.distance}</div>
              </div>

              {/* Estimated Time */}
              <div style={styles.tripDetail}>
                <div style={styles.tripDetailTitle}>Estimated Time</div>
                <div style={styles.infoBox}>{directionsResponse.time}</div>
              </div>

              {/* Price */}
              <div style={styles.tripDetail}>
                <div style={styles.tripDetailTitle}>Price</div>
                <div style={styles.infoBox}>
                  <span>{formatCurrency(price)}</span>
                </div>
              </div>

              {/* Book Button */}
              <div>
                {/* Form for source, destination, etc. */}
                <div style={styles.bookButtonContainer}>
                  <button onClick={handleBooking} style={styles.bookButton}>
                    Book
                  </button>
                </div>

                {/* Modal for loading and booking confirmation */}
                {showModal && (
                  <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                      {loading ? (
                        <>
                          <FaSpinner style={styles.spinner} />
                          <div>Loading...</div>
                        </>
                      ) : bookingSuccess ? (
                        <>
                          <FaCheckCircle style={styles.checkIcon} />
                          <div>Booked Transportation!</div>
                          {/* Go Home Button */}
                          <button onClick={() => navigate("/tourist/homepage")} style={styles.goHomeButton}>
                            Go Home
                          </button>
                        </>
                      ) : (
                        <>
                          <div>Booking failed, please try again.</div>
                          {/* Go Back Button */}
                          <button
                            onClick={() => setShowModal(false)} // Close the modal
                            style={styles.goBackButton}
                          >
                            Go Back
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
  },
  formContainer: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    alignItems: "center",
    width: "100%",
    maxWidth: "1000px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  inputSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    minWidth: "200px",
    flex: "1",
  },
  label: {
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  labelIcon: {
    marginRight: "5px",
    color: "#FFA500",
  },
  inputGroup: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    width: "100%",
  },
  icon: (active) => ({
    fontSize: "20px",
    color: active ? "#007BFF" : "#777",
  }),
  inputField: {
    flex: 1,
    border: "none",
    fontSize: "16px",
    outline: "none",
  },
  iconGroup: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  iconWrapper: (active) => ({
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: active ? "#007BFF" : "#777",
  }),
  iconLabel: (active) => ({
    fontSize: "12px",
    color: active ? "#FFA500" : "#777",
    textAlign: "center",
    fontWeight: active ? "bold" : "normal",
  }),
  datePickerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    width: "100%",
  },
  datePicker: {
    border: "none",
    outline: "none",
    fontSize: "16px",
    width: "100%",
  },
  scheduleButton: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "12px 40px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "15px",
  },
  loadingOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingMessage: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  mapAndInfoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
    width: "100%",
    maxWidth: "800px",
  },
  mapContainer: {
    width: "100%",
    maxWidth: "600px",
    height: "350px",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  },
  map: {
    width: "100%",
    height: "100%",
  },

  // Add new styles here for trip overview section
  tripOverview: {
    textAlign: "center",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
  },
  tripDetailContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "900px",
  },
  tripDetail: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    flex: 1,
    margin: "10px",
  },
  tripDetailTitle: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "8px",
    fontWeight: "bold",
  },
  infoBox: {
    padding: "10px 20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    display: "inline-block",
  },
  bookButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "10px",
  },
  bookButton: {
    backgroundColor: "#FF5722",
    color: "white",
    padding: "12px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "15px",
    width: "150px", // Adjust width for alignment
    textAlign: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    minWidth: "300px",
  },
  spinner: {
    fontSize: "40px",
    animation: "spin 2s linear infinite",
  },
  checkIcon: {
    fontSize: "40px",
    color: "green",
  },
  suggestionsDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: "#fff",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    maxHeight: "300px",
    overflowY: "auto",
    zIndex: 1000,
  },
  suggestionItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 15px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    borderBottom: "1px solid #ddd",
    width: "100%",
  },
  suggestionItemHover: {
    backgroundColor: "#f0f0f0",
  },
  suggestionIcon: {
    marginRight: "10px",
    color: "#007BFF",
  },
  suggestionText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  suggestionSubtext: {
    fontSize: "12px",
    color: "#777",
  },
  goHomeButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#28a745", // Green for success
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },

  goBackButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#FF5733", // Red/orange for failure
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Transportation;
