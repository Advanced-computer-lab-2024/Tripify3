import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/Login">Home</Link>
        </li>
        <li>
          <Link to="/governor">Governor</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
