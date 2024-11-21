import React from "react";
import TouristSidebar from "./touristSidebar.js";
import TouristNavbar from "./touristNavbar.js";
import { useLocation } from "react-router-dom";

const TouristLayout = ({ children }) => {
  const location = useLocation();

  // Check if the current route is '/chatbot'
  const isChatbotRoute = location.pathname === "/chatbot";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Top Navbar */}
      <TouristNavbar />

      {/* Layout with Sidebar and Main Content */}
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          marginTop: isChatbotRoute ? "60px" : "120px", // Adjust for Navbar height conditionally
        }}
      >
        {/* Scrollable Content Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            backgroundColor: "#f5f5f5",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default TouristLayout;
