const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Constants
const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.NODE_ENV;

// initialize express
const app = express();

app.listen(process.env.PORT, () => {
  console.log(`Server running in ${ENVIRONMENT} mode on port ${PORT}`);
});
