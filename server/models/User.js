const mongoose = require("mongoose");
const Wallet = require("./Wallet");

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
  cv: {
    type: [
      {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
  industry: {
    type: String,
  },
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
  savedJobs: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
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
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
