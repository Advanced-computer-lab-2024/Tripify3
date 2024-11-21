// TouristLayout.js
import React from "react";
import GuestNavbar from "./guestNavbar.js";
import { CenterFocusStrong } from "@mui/icons-material";

const GuestLayout = ({ children}) => (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    {/* Top Navbar */}
    <GuestNavbar />

    {/* Layout with Sidebar and Main Content */}
    <div style={{ display: "flex", flexGrow: 1, marginTop: "120px" }}> {/* Adjust for Navbar height */}
      {/* Conditionally Render Sidebar */}
    
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

export default GuestLayout;
