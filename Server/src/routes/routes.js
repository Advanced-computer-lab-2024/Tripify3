import userRoute from "./users.auth.route.js"; // Default import
import advertiserRoute from "./advertiser.user.route.js"; // Default import
import touristRoute from "./tourist.user.router.js"; // Default import
import sellerRoute from "./seller.user.route.js"; // Default import
import tourGuide from "./tourGuide.user.route.js";
// import adminroute from "./admin.user.route.js";

export default (app) => {
  app.use(userRoute);
  app.use(advertiserRoute);
  app.use(touristRoute);
  app.use(sellerRoute);
  app.use(tourGuide)
  // app.use(adminroute);
};
