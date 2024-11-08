import tourismGovernorRoute from "./tourismGovernor.route.js";
import userRoute from "./users.auth.route.js"; // Default import
import advertiserRoute from "./advertiser.route.js"; // Default import
import touristRoute from "./tourist.route.js"; // Default import
import sellerRoute from "./seller.route.js"; // Default import
import tourGuideRoute from "./tourGuide.route.js";
import placeRoute from "./place.route.js";
import activityRoute from "./activity.route.js";
import itineraryRoute from "./itinerary.route.js";
import bookingRoute from "./booking.route.js";
import adminRoute from "./admin.route.js";
import tagRoute from "./tag.route.js";
import complaintRoute from "./complaint.route.js";

export default (app) => {
  app.use(complaintRoute);
  app.use(tourismGovernorRoute);
  app.use(userRoute);
  app.use(tagRoute);
  app.use(advertiserRoute);
  app.use(touristRoute);
  app.use(sellerRoute);
  app.use(tourGuideRoute);
  app.use(placeRoute);
  app.use(activityRoute);
  app.use(itineraryRoute);
  app.use(bookingRoute);
  app.use(adminRoute);
  app.use(tourGuideRoute)
  app.use(placeRoute)
  app.use(activityRoute)
  app.use(adminRoute);
};
