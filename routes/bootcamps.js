const express = require("express");
const { protect, authorize } = require("../middleware/auth");

const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampWithinRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/Bootcamp");

// Include other resource routers
const courseRouter = require("./courses");

// Initialize Express Router
const router = express.Router();

// @route   GET api/v1/bootcamps
router.get("/", advancedResults(Bootcamp, "courses"), getBootCamps);

// @route   GET api/v1/bootcamps/:id
router.get("/:id", getBootCamp);

// @route   POST api/v1/bootcamps
router.post("/", protect, authorize("publisher", "admin"), createBootCamp);

// @route   PUT api/v1/bootcamps/:id
router.put("/:id", protect, authorize("publisher", "admin"), updateBootCamp);

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);

// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
router.get("/radius/:zipcode/:distance", getBootcampWithinRadius);

// @route   DELETE api/v1/bootcamps/:id
router.delete("/:id", protect, authorize("publisher", "admin"), deleteBootCamp);

// @route   PUT api/v1/bootcamps/:id/photo
router.put(
  "/:id/photo",
  protect,
  authorize("publisher", "admin"),
  bootcampPhotoUpload
);

module.exports = router;
