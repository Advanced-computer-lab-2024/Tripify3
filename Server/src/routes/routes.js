import userRoute from "./users.auth.route.js"; // Default import
import adminroute from "./admin.user.route.js";

export default (app) => {
  app.use(userRoute);
  app.use(adminroute);
};
