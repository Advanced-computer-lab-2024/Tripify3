import { body } from "express-validator";
import { getUsers } from "../controllers/test_controller.js";
import enumValidationMessage from "../enumerations/validation_message.js";
import validate from "../middlewares/request_validator_middleware.js";
//Syntax export default (app)=>{}

export default (app) => {
  app.post(
    "/testing",
    body("email", enumValidationMessage.IS_REQUIRED).notEmpty({
      ignore_whitespace: true,
    }),
    body("email", enumValidationMessage.SHOULD_BE_STRING).isString(),
    body("phone", enumValidationMessage.SHOULD_BE_INTEGER).optional().isInt(),
    // Then, the validate middleware is called
    // No need to pass by req to validate as express automaticallyinject them when it calls the middleware
    validate, // This middleware will check if there are any validation errors

    // If there are no validation errors, next() is called,
    // which means the request continues to this controller function
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
