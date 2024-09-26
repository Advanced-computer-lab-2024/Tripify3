const ErrorMiddleware = (error, req, res, next) => {
  try {
    const status = error.statusCode || 500;
    const message = error.message || "Something went wrong";
    const details = error.details || "Something went wrong";
    const errors = error.errors || undefined;

    console.log(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
    res.status(status).json({ message, details, errors });
  } catch (error) {
    next(error);
  }
};

module.exports = { ErrorMiddleware };
