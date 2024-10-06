import React, { useState, useEffect, useRef } from "react";
import { Box, TextField, Button, Modal, Typography } from "@mui/material";
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

// Set default icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const DoctorInformation = () => {
  const [location, setLocation] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const mapRef = useRef(null);
  let map;
  let marker;

  const reverseGeocode = (lat, lng) => {
    setLoadingAddress(true);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((response) => response.json())
      .then((data) => {
        setLocation(data.display_name);
        setClinicArea(data.address.suburb || data.address.village || data.address.town || "");
        setClinicGovernorate(data.address.county || data.address.state || "");
      })
      .catch((error) => console.error("Error:", error))
      .finally(() => setLoadingAddress(false));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    window.location.href = "../homePage.html"; // Change to your desired action
  };

  useEffect(() => {
    const cairoCoordinates = { lat: 30.0444, lng: 31.2357 }; // Cairo, Egypt
    map = L.map(mapRef.current).setView([cairoCoordinates.lat, cairoCoordinates.lng], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.on("click", function (e) {
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker(e.latlng).addTo(map); // Use default marker icon here
      setLocation("Fetching address...");
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  return (
    <Box className="container3" sx={{ mt: 10, px: 5, pb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Pin your activity's location on the map
      </Typography>
      <Box
        ref={mapRef}
        sx={{
          height: 500,
          width: "100%",
          mb: 2,
          bgcolor: "#e0e0e0",
        }}
      />

      <form id="doctorForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <TextField fullWidth label="Address" value={location} onChange={(e) => setLocation(e.target.value)} required sx={{ mb: 2 }} />
        </div>
        <Button type="submit" variant="contained" color="primary" className="btn-primary2">
          Submit
        </Button>
      </form>

      {/* Success Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <Typography variant="h5">Success</Typography>
          <Typography>Location added</Typography>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default DoctorInformation;
