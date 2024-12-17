const mongoose = require("mongoose");
const validator = require("validator"); 

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  coverLetter: {
    type: String,
    required: [true, "Please provide a cover letter!"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  address: {
    type: String,
    required: [true, "Please enter your Address!"],
  },
  resume: {
    public_id: {
      type: String, 
      required: false,
    },
    url: {
      type: String, 
      required: false,
    },
  },
  status: {
    type: String,
    enum: ["Processing", "Accepted", "Rejected"],
    default: "Processing",
  },
  jobID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: false
  },
  applicantID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Candidate"],
      required: true,
    },
  },
  employerID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Recruiter"],
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  interviewTime: {
    type: Date,
    required: false, 
  },
  interviewConfirmed: {
    type: String,
    enum: ["Yes", "No", "Pending"],
    default: "Pending",
    required: false, 
  },
  interviewAddress: {
    type: String,
    required: false, 
  },
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
