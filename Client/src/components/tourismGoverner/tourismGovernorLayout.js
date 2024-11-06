// TouristLayout.js
import React from "react";
import TourismGovernorSidebar from "./tourismGovernorSidebar.js";
import TourismGovernorNavbar from "./tourismGovernorNavbar.js";

const TourismGovernorLayout = ({ children}) => (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    {/* Top Navbar */}
    <TourismGovernorNavbar />

    {/* Layout with Sidebar and Main Content */}
    <div style={{ display: "flex", flexGrow: 1, marginTop: "120px" }}> {/* Adjust for Navbar height */}
      {/* Conditionally Render Sidebar */}
      <TourismGovernorSidebar />
      
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

export default TourismGovernorLayout;
