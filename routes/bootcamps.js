const express = require("express");

const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampWithinRadius,
} = require("../controllers/bootcamps");

// Include other resource routers
const courseRouter = require("./courses");

// Initialize Express Router
const router = express.Router();

// @route   GET api/v1/bootcamps
router.get("/", getBootCamps);

// @route   GET api/v1/bootcamps/:id
router.get("/:id", getBootCamp);

// @route   POST api/v1/bootcamps
router.post("/", createBootCamp);

// @route   PUT api/v1/bootcamps/:id
router.put("/:id", updateBootCamp);

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
router.get("/radius/:zipcode/:distance", getBootcampWithinRadius);

// @route   DELETE api/v1/bootcamps/:id
router.delete("/:id", deleteBootCamp);

module.exports = router;
