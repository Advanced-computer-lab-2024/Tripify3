// import React from "react";
// import AllActivities from "./AllActivities";
// import GetAllHistoricalPlaces from "./getAllHistoricalPlaces";
// import GetAllItineraries from "./getAllItineraries";
// import GetFilteredActivities from "./getFilteredActivities";
// import GetFilteredHistoricalPlaces from "./getFilteredHistoricalPlaces";
// import GetFilteredItineraries from "./getFilteredItineraries";
// import GetSortedActivities from "./getSortedActivities";
// import GetSortedItineraries from "./getSortedItineraries";
// import ProfileEdit from "./ProfileEdit";
// import ProfileView from "./ProfileView";

// const App = () => {
//   return (
//     <div>
//       <GetAllHistoricalPlaces />
//       <AllActivities />
//       <GetAllItineraries />
//       <GetFilteredActivities />
//       <GetFilteredHistoricalPlaces />
//       <GetFilteredItineraries />
//       <GetSortedActivities />
//       <GetSortedItineraries />
//       <ProfileEdit />
//       <ProfileView />
//     </div>
//   );
// };

// export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const TouristHomePage = () => {
  return (
    <div>
      <h1>Tourist Homepage</h1>
      <button>
        <Link to="/tourist/activities">Activities</Link>
      </button>
      <button>
        <Link to="/tourist/itineraries">Itineraries</Link>
      </button>
      <button>
        <Link to="/tourist/historical-places">Historical Places</Link>
      </button>
      <button>
        <Link to="/tourist/ProductList">ProductList</Link>
      </button>
      <button>
        <Link to="/tourist/SearchProduct">Search product</Link>
      </button>
      <button>
        <Link to="/tourist/FilterProduct">Filter product</Link>
      </button>
      <button>
        <Link to="/tourist/SortBy">sortByRating</Link>
      </button>
    </div>
  );
};

export default TouristHomePage;
