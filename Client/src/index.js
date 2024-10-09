import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Optional global CSS (if you have any)
import App from "./App.js"; // Import the main App component
import 'leaflet/dist/leaflet.css';


// Find the root DOM node and render the App component into it
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//index.js is the entry point of your React app, responsible for rendering the entire application.
//It renders the App.js component inside the <div id="root"> element in your index.html.
//This code is responsible for initializing the React app, rendering the main App component into the DOM (HTML page), and setting up the application's rendering lifecycle.
