// TouristLayout.js
import React from "react";
import { CenterFocusStrong } from "@mui/icons-material";
import AdvertiserSidebar from "./advertiserSidebar.js";
import AdvertiserNavbar from "./advertiserNavbar.js";

const AdvertiserLayout = ({ children }) => (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    {/* Top Navbar */}
    <AdvertiserNavbar />

    {/* Layout with Sidebar and Main Content */}
    <div style={{ display: "flex", flexGrow: 1, marginTop: "60px" }}>
      {" "}
      {/* Adjust for Navbar height */}
      {/* Conditionally Render Sidebar */}
      <AdvertiserSidebar />
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

export default AdvertiserLayout;
