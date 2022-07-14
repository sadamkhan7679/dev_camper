const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    // minlength: [5, "Course title must be at least 5 characters"],
    // maxlength: [50, "Course title must be less than 50 characters"],
    trim: true,
    unique: [true, "Course title must be unique"],
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    // minlength: [5, "Course description must be at least 5 characters"],
    // maxlength: [500, "Course description must be less than 500 characters"],
  },
  weeks: {
    type: Number,
    required: [true, "Please add a number of weeks"],
  },
  tuition: {
    type: Number,
    required: [true, "Please add a tuition cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "Please add a minimum skill"],
    enum: ["beginner", "intermediate", "advanced"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: [true, "Please add a bootcamp"],
  },
});

module.exports = mongoose.model("Course", CourseSchema);
