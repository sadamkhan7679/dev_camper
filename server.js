const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
connectDB();

// Route Files
const bootCamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

// middleware files
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");

// Constants
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV;

// initialize express
const app = express();

// Middelware

// Body parse
app.use(express.json());

// Dev logging middleware

if (ENVIRONMENT === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootCamps);
app.use("/api/v1/courses", courses);

// Error Handler
app.use(errorHandler);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running in ${ENVIRONMENT} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
