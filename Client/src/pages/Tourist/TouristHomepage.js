import React from "react";
import AllActivities from "./AllActivities";
import GetAllHistoricalPlaces from "./getAllHistoricalPlaces";
import GetAllItineraries from "./getAllItineraries";
import GetFilteredActivities from "./getFilteredActivities";
import GetFilteredHistoricalPlaces from "./getFilteredHistoricalPlaces";
import GetFilteredItineraries from "./getFilteredItineraries";
import GetSortedActivities from "./getSortedActivities";
import GetSortedItineraries from "./getSortedItineraries";
import ProfileEdit from "./ProfileEdit";
import ProfileView from "./ProfileView";

const App = () => {
  return (
    <div>
      <GetAllHistoricalPlaces />
      <AllActivities />
      <GetAllItineraries />
      <GetFilteredActivities />
      <GetFilteredHistoricalPlaces />
      <GetFilteredItineraries />
      <GetSortedActivities />
      <GetSortedItineraries />
      <ProfileEdit />
      <ProfileView />
    </div>
  );
};

export default App;
