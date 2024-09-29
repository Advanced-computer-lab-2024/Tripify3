import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="container">
        <ul>
          <li>
            <Link to="/Login">Home</Link>
          </li>
          <li>
            <Link to="/governor">Governor</Link>
          </li>
          <li>
            <Link to="/governor/addPlace">Add Place</Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
