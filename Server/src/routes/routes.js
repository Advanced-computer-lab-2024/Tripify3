import touristRoute from "./tourist.user.route.js"; // Default import
import testRoute from "./test_route.js";
import tourGuide from "./tourGuide.user.route.js";
import bookings from "./bookings.js"

export default (app) => {
  app.use(touristRoute);
  app.use(tourGuide)
  app.use(testRoute);
  app.use(bookings)
};
