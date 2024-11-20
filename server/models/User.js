const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ["Candidate", "Recruiter", "Admin"],
  },
  avatar: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
      default: "https://res.cloudinary.com/dpocdj6eu/image/upload/v1728065130/ksf2naqlfcnahv1ck1cm.png",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  // Thông tin bổ sung cho Recruiter
  companyName: {
    type: String,
    required: function () {
      return this.role === "Recruiter";
    },
  },
  website: {
    type: String,
  },
  address: {
    type: String,
    required: function () {
      return this.role === "Recruiter";
    },
  },
  numberOfEmployees: {
    type: Number,
  },
  // Thông tin bổ sung cho Candidate
  skills: {
    type: [String], // Mảng chứa các kỹ năng
    required: function () {
      return this.role === "Candidate";
    },
    default: [],
  },
  experience: {
    type: [String], // Mô tả kinh nghiệm làm việc
    required: function () {
      return this.role === "Candidate";
    },
    default: [],
  },
  education: {
    type: [String], // Mô tả quá trình học vấn
    required: function () {
      return this.role === "Candidate";
    },
    default: [],
  },
  status: {
    type: String,
    enum: ["active", "locked"],
    default: "active",
    required: function () {
      return this.role !== "Admin"; // Only required for non-admin users
    },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
