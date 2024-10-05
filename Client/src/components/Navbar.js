import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="container">
        <ul>
          <li>
            <Link to="/Login">Login</Link>
          </li>
          <li>
            <Link to="/governor">Signup as a Tourist</Link>
          </li>
          <li>
            <Link to="/governor">Signup as a Tour Guide/ Advertiser/ Seller </Link>
          </li> 
           <li>
            <Link to="/governor">Governor</Link>
          </li>  
          <li>
            <Link to="/governor">Seller</Link>
          </li> 
           <li>
            <Link to="/governor">Advertiser</Link>
          </li>
          <li>
            <Link to="/governor">Tour Guide</Link>
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
