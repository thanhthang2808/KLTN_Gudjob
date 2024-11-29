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

    const jobID = jobId;
    if (!name || !email || !coverLetter || !phone || !address || !applicantID || !employerID || !resume || !jobID) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      jobID,
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
    const { id } = req.user;
    const applications = await Application.find({ "employerID.user": id });
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

  const acceptApplication = async (req, res) => {
    try {
      const { id } = req.params; // Get the application ID from request parameters
      const application = await Application.findById(id);
  
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
  
      // Update the application status to 'Accepted'
      application.status = "Accepted";
      await application.save();
  
      return res.status(200).json({ message: "Application accepted successfully", application });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to accept application", error: error.message });
    }
  };
  
  // Reject an application
  const rejectApplication = async (req, res) => {
    try {
      const { id } = req.params; // Get the application ID from request parameters
      const application = await Application.findById(id);
  
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
  
      // Update the application status to 'Rejected'
      application.status = "Rejected";
      await application.save();
  
      return res.status(200).json({ message: "Application rejected successfully", application });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to reject application", error: error.message });
    }
  };

const getApplicationsForAJob = async (req, res) => {
  try {
    const { id } = req.params;
    const applications = await Application.find({ jobID: id });
    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error in getApplicationsForAJob:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

const checkJobAppliedForCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const applications = await Application.find({ jobID: id, "applicantID.user": req.user.id });
    if (applications.length > 0) {
      return res.status(200).json({ success: true, message: "Job already applied!" });
    } else {
      return res.status(200).json({ success: false, message: "Job not applied!" });
    }
  } catch (error) {
    console.error("Error in checkJobApplicatedForCandidate:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
  

  

module.exports = { postApplication, recruiterGetAllApplications, candidateGetAllApplications, candidateDeleteApplication, rejectApplication, acceptApplication, getApplicationsForAJob, checkJobAppliedForCandidate };