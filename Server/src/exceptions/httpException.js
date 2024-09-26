class BaseError extends Error {
  constructor(message, details) {
    super();
    this.message = message;
    this.details = details;
  }
}

class HTTPError extends BaseError {
  constructor(message, details, statusCode) {
    super(message, details);
    this.statusCode = statusCode;
  }
}

class InvalidHTTPError extends HTTPError {
  constructor(details) {
    super("Invalid Request", details, 400);
  }
}

class UnauthorizedHTTPError extends HTTPError {
  constructor(details) {
    super("Forbidden", details, 401);
  }
}

class ForbiddenHTTPError extends HTTPError {
  constructor(details) {
    super("Forbidden", details, 403);
  }
}

class NotFoundHTTPError extends HTTPError {
  constructor(details) {
    super("Resource Not Found", details, 404);
  }
}

class GoneHTTPError extends HTTPError {
  constructor(details) {
    super("Resource Gone", details, 410);
  }
}

class MethodNotAllowedHTTPError extends HTTPError {
  constructor(details) {
    super("Method Not Allowed", details, 405);
  }
}

class ConflictHTTPError extends HTTPError {
  constructor(details) {
    super("Conflict", details, 409);
  }
}

class TooManyRequestsHTTPError extends HTTPError {
  constructor(details) {
    super("Too Many Requests", details, 429);
  }
}

class InternalHTTPError extends HTTPError {
  constructor(details) {
    super("Internal Server Error", details, 500);
  }
}

// 400s
class InvalidParameterError extends InvalidHTTPError {
  constructor(details, errors) {
    super(details);
    this.errors = errors;
  }
}

// 401s
class UnauthorizedError extends UnauthorizedHTTPError {}

// 403s
class ForbiddenError extends ForbiddenHTTPError {}

// 404s
class NotFoundError extends NotFoundHTTPError {}

// 410s
class GoneError extends GoneHTTPError {}

// 405s
class MethodNotAllowedError extends MethodNotAllowedHTTPError {}

// 409s
class DuplicateError extends ConflictHTTPError {}

// 429s
class TooManyAttemptsError extends TooManyRequestsHTTPError {}

// 500s
class ServerError extends InternalHTTPError {}
class DatabaseError extends InternalHTTPError {}
class UpstreamError extends InternalHTTPError {}
class ValidationError extends InternalHTTPError {}
class EncryptionError extends InternalHTTPError {}

module.exports = {
  BaseError,
  HTTPError,
  InvalidParameterError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  GoneError,
  MethodNotAllowedError,
  DuplicateError,
  TooManyAttemptsError,
  ServerError,
  DatabaseError,
  UpstreamError,
  ValidationError,
  EncryptionError,
};
