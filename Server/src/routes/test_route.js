import { body } from "express-validator";
import { getUsers } from "../controllers/test_controller.js";
import enumValidationMessage from "../enumerations/validation_message.js";
import validate from "../middlewares/request_validator_middleware.js";
//Syntax export default (app)=>{}

export default (app) => {
  app.post(
    "/testing",
    getUsers // This is the controller function that will handle the request
    //
  );
};
/*
Key Point:
You don’t need to pass req, res, or next explicitly when calling middleware or controller functions in the route definition. fr ex ( validate,getUsers) just the name of the function
Express automatically handles this (the passing of these parameters that these functions take) for you when a request is processed. However, your middleware and controller functions should be designed to accept these parameters, 
as Express will inject them during execution.

Summary:
Middleware (validate): Automatically receives req, res, and next. Express calls next() if there are no validation errors, moving to the next step in the chain.
Controller (getUsers): Automatically receives req and res from Express, allowing you to handle the request without manually passing these parameters.
 */
