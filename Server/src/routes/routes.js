import touristRoute from "./tourist.user.route.js"; // Default import
import testRoute from "./test_route.js";
import adminroute from "./admin.user.route.js";

export default (app) => {
  app.use(touristRoute);
  app.use(testRoute);
  app.use(adminroute);
};
