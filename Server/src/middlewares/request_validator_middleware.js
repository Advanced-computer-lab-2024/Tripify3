import { validationResult } from "express-validator";
import enumHttp from "../enumerations/http_code.js";
import enumStatus from "../enumerations/response_status.js";

//As soon as validate is called in the route definition, Express automatically invokes the middleware function, passing the current req, res, and next objects from the request

export default async (req, res, next) => {
  // Validate on the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(enumHttp.BAD_REQUEST).json({
      status: enumStatus.NEGATIVE,
      errors: errors.array(),
    });
    // DO NOT CALL CONTROLLER OR EXECUTE CONTROLLER FUNCTION
    return;
  }

  next();

  /* NEXT() EXPLAINATION
  If there are no validation errors (i.e., errors.isEmpty() is true), the next() function is called to pass control to the next middleware or route handler.
  aka in this case since in the route we call the middleware then the controller function, then it goes on and calls the controller function
  */

  /*
    Without next(): The request will end at that middleware if a response (res.status(...).json(...), etc.) is sent. This means no further middleware or route handlers will execute. Usuaaly in the controller(last step of execution nothing after it)
    With next(): If no response is sent in the middleware, calling next() will move the request to the next middleware or controller in the chain. aka when it passes a phase it passes the request to the next phase(controllor function)
   */
};

/*METHOD EXPLAINATION
validationResult(req) : built in function in express-validator, checks if there were any validation errors in the req (request object). 
These validators are defined in the route, using functions like body(), param(), or query() from express-validator.
If validation fails (i.e., the user submits invalid data), validationResult(req) will contain an array of error messages, 
such as "Email is required" or "Password must be at least 8 characters".

if (!errors.isEmpty()) {
This checks if the array of errors is empty. If it’s not empty, it means that validation failed and there are errors to report.

if validation failed, the server sends a 400 Bad Request response using res.status(enumHttp.BAD_REQUEST).
The response is JSON with two fields:
status: Set to enumStatus.NEGATIVE (likely to indicate failure or error in the response).
errors: This contains the array of validation errors from errors.array(), which includes all the issues that failed validation.


Example response if validation fails:
{
  "status": "negative",
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "Password must be at least 8 characters",
      "param": "password",
      "location": "body"
    }
  ]
 */
