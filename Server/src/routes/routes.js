import userRoute from "./users.auth.route.js"; // Default import

export default (app) => {
  app.use(userRoute);

};
