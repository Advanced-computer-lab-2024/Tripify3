import React from "react";
import TourGuideSidebar from "./tourGuideSidebar.js";
import TourGuideNavbar from "./tourGuideNavbar.js"

const TourGuideLayout = ({ children }) => (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
       <TourGuideNavbar />
      {/* Fixed sidebar */}
      <TourGuideSidebar />
      {/* Scrollable content area */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: "70px", backgroundColor: "#f5f5f5" }}>{children}</div>
    </div>
  );

  export default TourGuideLayout; 


  