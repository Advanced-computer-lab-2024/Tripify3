import tourismGovernorRoute from "./tourismGovernor.route.js";
import userRoute from "./users.auth.route.js"; // Default import
import advertiserRoute from "./advertiser.route.js"; // Default import
import touristRoute from "./tourist.route.js"; // Default import
import sellerRoute from "./seller.route.js"; // Default import
import tourGuideRoute from "./tourGuide.route.js";
import placeRoute from './place.route.js';
import activityRoute from './activity.route.js'
import ItineraryRoute  from "./itinerary.route.js";
import BookingRoute from "./booking.route.js"
import TripRoute from "./trip.route.js"
import adminroute from "./admin.route.js";


export default (app) => {
  app.use(tourismGovernorRoute);
  app.use(userRoute);
  app.use(advertiserRoute);
  app.use(touristRoute);
  app.use(sellerRoute);
  app.use(tourGuideRoute)
  app.use(placeRoute)
  app.use(activityRoute)
  app.use(ItineraryRoute)
  app.use(adminroute);
  app.use(BookingRoute)
  app.use(TripRoute)
  app.use(ItineraryRoute)
  app.use(adminroute);
  app.use(BookingRoute)
  app.use(TripRoute)
  app.use(adminroute);
};
