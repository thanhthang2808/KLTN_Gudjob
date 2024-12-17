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
    maxLength: [1000, "Description cannot exceed 1000 Characters!"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category."],
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  location: {
    type: String,
  },
  fixedSalary: {
    type: Number,
    min: [0, "Salary must be a positive number."],
    max: [9999999999, "Salary cannot exceed 10 digits."],
  },
  salaryFrom: {
    type: Number,
    min: [0, "Salary must be a positive number."],
    max: [9999999999, "Salary cannot exceed 10 digits."],
  },
  salaryTo: {
    type: Number,
    min: [0, "Salary must be a positive number."],
    max: [9999999999, "Salary cannot exceed 10 digits."],
  },
  applicationDeadline: {
    type: Date,
  },
  experience: {
    type: String,
    enum: ["Không yêu cầu kinh nghiệm", "Dưới 1 năm", "1 năm", "2 năm", "3 năm", "4 năm", "5 năm", "Trên 5 năm"],
  },
  level: {
    type: String,
    enum: ["Thực tập sinh", "Nhân viên Mới", "Nhân viên", "Nhân viên Cấp cao", "Trưởng nhóm"],
  },
  vacancies: {
    type: Number,
    min: [1, "Number of vacancies must be at least 1."],
  },
  workType: {
    type: String,
    enum: ["Dài hạn", "Ngắn hạn", "Tự do", "Thực tập"],
  },
  gender: {
    type: String,
    enum: ["Nam", "Nữ", "Tất cả"],
  },
  requiredSkills: {
    type: [String],
    default: [],
  },
  expired: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  isFeatured: {
    type: Boolean,
    default: false
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

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
