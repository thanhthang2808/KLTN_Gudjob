const Application = require("../../models/Application");
const Job = require("../../models/Job");
const cloudinary = require("../../uploads/cloudinary");

const postApplication = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Recruiter") {
      return res.status(400).json({ message: "Recruiter not allowed to access this resource." });
    }
    console.log("resume:", req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Resume File Required!" });
    }

    const { resume } = req.files;

    const allowedFormats = ["application/pdf", "application/msword", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedFormats.includes(resume.mimetype)) {
      return res.status(400).json({ message: "Invalid file type. Please upload a PNG file." });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(resume.tempFilePath);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error("Cloudinary Error:", cloudinaryResponse.error || "Unknown Cloudinary error");
      return res.status(500).json({ message: "Failed to upload Resume to Cloudinary" });
    }

    const { name, email, coverLetter, phone, address, jobId } = req.body;
    const applicantID = {
      user: req.user.id,
      role: "Candidate",
    };
    if (!jobId) {
      return res.status(404).json({ message: "Job not found!" });
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
      return res.status(404).json({ message: "Job not found!" });
    }

    const employerID = {
      user: jobDetails.postedBy,
      role: "Recruiter",
    };
    if (!name || !email || !coverLetter || !phone || !address || !applicantID || !employerID || !resume) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      jobId,
      applicantID,
      employerID,
      resume: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  } catch (error) {
    console.error("Error in postApplication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const recruiterGetAllApplications = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Candidate") {
      return res.status(400).json({ message: "Candidate not allowed to access this resource." });
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error in employerGetAllApplications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const candidateGetAllApplications = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Recruiter") {
      return res.status(400).json({ message: "Recruiter not allowed to access this resource." });
    }
    const { id } = req.user;
    const applications = await Application.find({ "applicantID.user": id });
    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error in jobseekerGetAllApplications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const candidateDeleteApplication = async (req, res) => {
    try {
      const { role } = req.user;
      if (role === "Recruiter") {
        return res.status(400).json({ message: "Recruiter not allowed to access this resource." });
      }
  
      const { id } = req.params;
      const application = await Application.findById(id);
  
      if (!application) {
        return res.status(404).json({ message: "Application not found!" });
      }
  
      // Extract the resume's public_id from the application
      const resumePublicId = application.resume.public_id;
  
      // Delete the resume from Cloudinary
      await cloudinary.uploader.destroy(resumePublicId, (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return res.status(500).json({ message: "Failed to delete resume from Cloudinary" });
        }
      });
  
      // Delete the application from the database
      await application.deleteOne();
  
      res.status(200).json({
        success: true,
        message: "Application and resume deleted!",
      });
    } catch (error) {
      console.error("Error in candidateDeleteApplication:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

module.exports = { postApplication, recruiterGetAllApplications, candidateGetAllApplications, candidateDeleteApplication };