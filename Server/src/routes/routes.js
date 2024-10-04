// import touristRoute from "./tourist.user.route.js"; // Default import
// import testRoute from "./test_route.js";
import tourismGovernor from "./tourism.governor.route.js";
import userRoute from "./users.auth.route.js"; // Default import
import advertiserRoute from "./advertiser.user.route.js"; // Default import

export default (app) => {
  // app.use(touristRoute);
  // app.use(testRoute);
  app.use(tourismGovernor);
  app.use(userRoute);
  app.use(advertiserRoute);
// import adminroute from "./admin.user.route.js";

};
