// import touristRoute from "./tourist.user.route.js"; // Default import
// import testRoute from "./test_route.js";
import tourismGovernor from "./tourismGovernor.route.js";
import userRoute from "./users.auth.route.js"; // Default import
import advertiserRoute from "./advertiser.user.route.js"; // Default import
import touristRoute from "./tourist.user.router.js"; // Default import
import sellerRoute from "./seller.user.route.js"; // Default import
import tourGuide from "./tourGuide.user.route.js";
import location from './location.route.js';
import activity from './activity.route.js'
import Itinerary  from "./itinerary.route.js";
import Booking from "./booking.route.js"
import Trip from "./trip.route.js"
import adminroute from "./admin.user.route.js";


export default (app) => {
  // app.use(touristRoute);
  // app.use(testRoute);
  app.use(tourismGovernor);
  app.use(userRoute);
  app.use(advertiserRoute);
  app.use(touristRoute);
  app.use(sellerRoute);
  app.use(tourGuide)
  app.use(location)
  app.use(activity)
  app.use(Itinerary)
  app.use(Itinerary)
  app.use(adminroute);
  app.use(Booking)
  app.use(Trip)
  app.use(touristRoutes)
  app.use(Itinerary)
  app.use(adminroute);
  app.use(Booking)
  app.use(Trip)
  app.use(touristRoutes)
  app.use(adminroute);
  app.use(Booking)
  app.use(Trip)
};
