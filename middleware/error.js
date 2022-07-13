const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Send correct status code
  if (err.statusCode) {
    res.status(err.statusCode);
  } else {
    res.status(500);
  }

  // Return error message
  res.json({ success: false, message: error.message });
  //
  // res.status(err.statusCode || 500).json({
  //   success: false,
  //   message: err.message || "Server Error",
  // });
};

module.exports = errorHandler;
