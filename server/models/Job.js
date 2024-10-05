const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."],
    minLength: [3, "Title must contain at least 3 Characters!"],
    maxLength: [30, "Title cannot exceed 30 Characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description."],
    minLength: [10, "Description must contain at least 10 Characters!"],
    maxLength: [500, "Description cannot exceed 500 Characters!"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category."],
  },
  country: {
    type: String,
    required: [true, "Please provide a country name."],
  },
  city: {
    type: String,
    required: [true, "Please provide a city name."],
  },
  location: {
    type: String,
    required: [true, "Please provide location."],
  },
  fixedSalary: {
    type: Number,
    min: [0, "Salary must be a positive number."],
    max: [999999999, "Salary cannot exceed 9 digits."],
  },
  salaryFrom: {
    type: Number,
    min: [0, "Salary must be a positive number."],
    max: [999999999, "Salary cannot exceed 9 digits."],
  },
  salaryTo: {
    type: Number,
    min: [0, "Salary must be a positive number."],
    max: [999999999, "Salary cannot exceed 9 digits."],
  },
  negotiableSalary: {
    type: Boolean,
    default: false,
  },
  applicationDeadline: {
    type: Date,
  },
  experience: {
    type: String,
      },
  level: {
    type: String,
    enum: ["Intern", "Junior", "Mid", "Senior", "Lead"],

  },
  vacancies: {
    type: Number,
    min: [1, "Number of vacancies must be at least 1."],
  },
  workType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship"],
  
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Any"],
  },
  requiredSkills: {
    type: [String],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Job", jobSchema);
