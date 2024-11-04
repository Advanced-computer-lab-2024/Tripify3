import React from "react";
import TourGuideSidebar from "./tourGuideSidebar.js";
import TourGuideNavbar from "./tourGuideavbar.js"

const TourGuideLayout = ({ children }) => (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
       <TourGuideNavbar />
      {/* Fixed sidebar */}
      <TourGuideSidebar />
      {/* Scrollable content area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", backgroundColor: "#f5f5f5" }}>{children}</div>
    </div>
  );

  export default TourGuideLayout; 


  