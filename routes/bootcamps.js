const express = require("express");

const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
} = require("../controllers/bootcamps");

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

// @route   DELETE api/v1/bootcamps/:id
router.delete("/:id", deleteBootCamp);

module.exports = router;
