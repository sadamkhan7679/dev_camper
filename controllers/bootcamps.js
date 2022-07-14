const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  console.log("getBootCamps query", req.query);
  let query;
  // copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // fields you want to select from the db e.g. select=name,description
  //query.select('name description');
  // query = query.select('name description');

  // Sort data
  // sort data by price lowest to highest
  // if (req.query.sortBy) {
  //   const sortBy = req.query.sortBy.split(",").join(" ");
  //   query = Bootcamp.find(reqQuery).sort(sortBy);
  // } else {
  //   query = query.sort("-createdAt");
  //   query = Bootcamp.find(reqQuery);
  // }

  // Pagination
  // Number of docs per page
  // const page = parseInt(req.query.page, 10) || 1;
  // // Number of docs to skip
  // const limit = parseInt(req.query.limit, 10) || 100;
  // // Skip number of docs
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // // Get the total count of docs in the db
  // const total = await Bootcamp.countDocuments();
  // // Add to query to skip and limit the amount of docs returned
  // query = query.skip(startIndex).limit(limit);
  //
  // // Pagination result
  // const pagination = {};
  // if (endIndex < total) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit,
  //   };
  // }
  // if (startIndex > 0) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit,
  //   };
  // }
  //
  // // Select Fields
  // const select = req.query.select.split(",").join(" ");

  // Create query string
  let queryStr = JSON.stringify(req.query);
  // Add special chracters from query
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // Parse query string
  console.log("queryStr", queryStr);
  query = JSON.parse(queryStr);
  //

  const bootcamps = await Bootcamp.find(query).populate("courses");
  res
    .status(200)
    .json({ success: true, data: bootcamps, count: bootcamps.length });
});

// @desc Get bootcamp by id
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Create bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  const body = req.body;

  const bootcamp = await Bootcamp.create(body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampWithinRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get latitude and longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  // Calc radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 3963 miles / 6378km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: bootcamp });
});
