import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate(); // Hook to enable navigation

  return (
    <header>
      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)} // This will navigate back
          style={{
            background: "none",
            border: "1px solid black", // Add border to ensure visibility
            padding: "10px",
            cursor: "pointer",
            fontSize: "18px",
            display: "inline-flex",
            alignItems: "center",
            marginBottom: "20px", // Add margin to separate it from other elements
            backgroundColor: "#000000" // Add background color for visibility
          }}
        >
          &#8592; Back
        </button>

        {/* Other navigation links */}
        {/* <ul>
          <li>
            <Link to="/Login">Login</Link>
          </li>
          <li>
            <Link to="/Signup">Signup</Link>
          </li>
          <li>
            <Link to="/governor">Governor</Link>
          </li>
          <li>
            <Link to="/seller">Seller</Link>
          </li>
          <li>
            <Link to="/advertiser">Advertiser</Link>
          </li>
          <li>
            <Link to="/tour-guide">Tour Guide</Link>
          </li>
          <li>
            <Link to="/governor/addPlace">Add Place</Link>
          </li>
        </ul> */}
      </div>
    </header>
  );
};

export default Header;
