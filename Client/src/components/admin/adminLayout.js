// TouristLayout.js
import React from "react";
import { CenterFocusStrong } from "@mui/icons-material";
import AdminSidebar from "./adminNavbar.js";
import AdminNavbar from "./adminSidebar.js";

const AdminLayout = ({ children }) => (
  <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
    {/* Top Navbar */}
    <AdminNavbar />

    {/* Layout with Sidebar and Main Content */}
    <div style={{ display: "flex", flexGrow: 1, marginTop: "50px" }}>
      <AdminSidebar />
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

export default AdminLayout;
