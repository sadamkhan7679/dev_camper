const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

const fileupload = require("express-fileupload");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to MongoDB
connectDB();

// Route Files
const bootCamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");

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

// Cookie parser
app.use(cookieParser());

// Dev logging middleware

if (ENVIRONMENT === "development") {
  app.use(morgan("dev"));
}

// File upload middleware
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/bootcamps", bootCamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);

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
