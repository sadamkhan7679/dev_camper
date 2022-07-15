const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require("path");

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootCamps = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: res.advancedResults });

  // console.log("getBootCamps query", req.query);
  //
  // // Fields to exclude
  // const removeFields = ["select", "sort", "page", "limit"];
  //
  // // Loop over removeFields and delete them from reqQuery
  // removeFields.forEach((param) => delete reqQuery[param]);
  //
  // // fields you want to select from the db e.g. select=name,description
  // //query.select('name description');
  // // query = query.select('name description');
  //
  // // Sort data
  // // sort data by price lowest to highest
  // // if (req.query.sortBy) {
  // //   const sortBy = req.query.sortBy.split(",").join(" ");
  // //   query = Bootcamp.find(reqQuery).sort(sortBy);
  // // } else {
  // //   query = query.sort("-createdAt");
  // //   query = Bootcamp.find(reqQuery);
  // // }
  //
  // // Pagination
  // // Number of docs per page
  // // const page = parseInt(req.query.page, 10) || 1;
  // // // Number of docs to skip
  // // const limit = parseInt(req.query.limit, 10) || 100;
  // // // Skip number of docs
  // // const startIndex = (page - 1) * limit;
  // // const endIndex = page * limit;
  // // // Get the total count of docs in the db
  // // const total = await Bootcamp.countDocuments();
  // // // Add to query to skip and limit the amount of docs returned
  // // query = query.skip(startIndex).limit(limit);
  // //
  // // // Pagination result
  // // const pagination = {};
  // // if (endIndex < total) {
  // //   pagination.next = {
  // //     page: page + 1,
  // //     limit,
  // //   };
  // // }
  // // if (startIndex > 0) {
  // //   pagination.prev = {
  // //     page: page - 1,
  // //     limit,
  // //   };
  // // }
  // //
  // // // Select Fields
  // // const select = req.query.select.split(",").join(" ");
  //
  // // Create query string
  // let queryStr = JSON.stringify(req.query);
  // // Add special chracters from query
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  // // Parse query string
  // console.log("queryStr", queryStr);
  // query = JSON.parse(queryStr);
  // //
  //
  // const bootcamps = await Bootcamp.find(query).populate("courses");
  // res
  //   .status(200)
  //   .json({ success: true, data: bootcamps, count: bootcamps.length });
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

// @desc Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Public
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  console.log("req.files", req.files);

  const file = req.files.file;

  if (!file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(200).json({ success: true, data: file.name });
  });
});
