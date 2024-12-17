const Application = require("../../models/Application");
const Job = require("../../models/Job");
const cloudinary = require("../../uploads/cloudinary");
const { sendEmail } = require("../chat-notification/send-mail-controller");

const postApplication = async (req, res) => {
  try {
    const { role } = req.user;

    if (role === "Recruiter") {
      return res
        .status(400)
        .json({ message: "Recruiter not allowed to access this resource." });
    }

    const { name, email, coverLetter, phone, address, jobId, resume } = req.body;

    // Kiểm tra dữ liệu từ client
    if (!jobId) {
      return res.status(404).json({ message: "Job not found!" });
    }

    if (!name || !email || !coverLetter || !phone || !address || !resume) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    console.log("cover", coverLetter);

    console.log("resume", resume.url, resume.public_id);
    // Kiểm tra thông tin CV (resume)
    if (!resume.url || !resume.public_id) {
      return res.status(400).json({
        message: "Invalid resume information. Please select a valid CV.",
      });
    }

    // Tìm thông tin công việc
    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
      return res.status(404).json({ message: "Job not found!" });
    }

    // Chuẩn bị thông tin ứng dụng
    const applicantID = {
      user: req.user.id,
      role: "Candidate",
    };

    const employerID = {
      user: jobDetails.postedBy,
      role: "Recruiter",
    };

    // Tạo ứng dụng
    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      jobID: jobId,
      applicantID,
      employerID,
      resume,
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

const getTotalApplications = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    res.status(200).json({ success: true, totalApplications });
  } catch (error) {
    console.error("Error in getTotalApplications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}  

const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, interviewTime, interviewConfirmed, interviewAddress } = req.body;

    if (!applicationId || !interviewTime || !interviewConfirmed) {
      return res.status(400).json({ success: false, message: "Missing required fields!" });
    }

    const application = await Application.findById(applicationId).populate("employerID.user");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found!" });
    }

    application.interviewTime = interviewTime;
    application.interviewConfirmed = interviewConfirmed;
    application.interviewAddress = interviewAddress;

    await application.save();

    sendEmail(application.email, 'Xác nhận lịch phỏng vấn!', `Chúc mừng bạn đã nhận được lời mời phỏng vấn từ ${application.employerID.user.companyName} !\n\n Thời gian: ${interviewTime}\n Địa chỉ: ${interviewAddress}\n\n Vui lòng xác nhận tham gia phỏng vấn bằng cách truy cập vào tài khoản của bạn.`);

    res.status(200).json({
      success: true,
      message: "Interview scheduled successfully!",
      data: application,
    });
  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

  

module.exports = { postApplication, recruiterGetAllApplications, candidateGetAllApplications, candidateDeleteApplication, rejectApplication, acceptApplication, getApplicationsForAJob, checkJobAppliedForCandidate, getTotalApplications, scheduleInterview };