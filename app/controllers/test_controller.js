import enumHttp from "../enumerations/http_code.js";
import enumStatus from "../enumerations/response_status.js";

export const getUsers = (req, res) => {
  console.log("Test");
  try {
    console.log(typeof req.body.email);

    res.status(enumHttp.OK).json({
      status: enumStatus.POSITIVE,
    });
    console.log("Horrayyyyy");
  } catch (err) {
    res.status(enumHttp.BAD_REQUEST).json({
      status: enumStatus.NEGATIVE,
      message: err.message,
    });
  }
};

/*
 Just like the middleware, when the request reaches the getUsers controller function, Express automatically passes req and res into the function. 
 The controller doesn’t need to explicitly receive these parameters from the route definition; it just needs to accept them as arguments to handle the request.

 the controller function can take next as the third parameter, just like middleware. This is useful when you want to: 
 Handle errors using error-handling middleware by calling next() with an error. Or passing it to another middleware incase i don't wanna return a response like i did with validate
  try {
    // Business logic for handling the request
    const users = [{ name: "John Doe" }, { name: "Jane Doe" }];
    
    // Send a response
    res.status(200).json(users);
  } catch (error) {
    // If an error occurs, pass it to the next middleware (usually an error handler)
    next(error);
  }
};
 */
