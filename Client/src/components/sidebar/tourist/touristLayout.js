import React from "react";
import TouristSidebar from "./touristSidebar.js";

const TouristLayout = ({ children }) => (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Fixed sidebar */}
      <TouristSidebar />
      {/* Scrollable content area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", backgroundColor: "#f5f5f5" }}>{children}</div>
    </div>
  );

  export default TouristLayout; 