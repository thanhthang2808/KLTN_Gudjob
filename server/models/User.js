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
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
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
  },
  experience: {
    type: String, // Mô tả kinh nghiệm làm việc
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
