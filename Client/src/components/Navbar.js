import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Header.css'; // Add a CSS file for styles if needed

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container" style={{ position: "relative", zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          &#8592; Back
        </button>

        <nav>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/signup">signup</Link>
           
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;