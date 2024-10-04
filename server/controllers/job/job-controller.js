
const Job = require("../../models/Job");

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const postJob = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Candidate") {
      return res.status(400).json({
        success: false,
        message: "Candidate not allowed to access this resource.",
      });
    }
    
    const {
      title,
      description,
      category,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
    } = req.body;

    if (!title || !description || !category || !country || !city || !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide full job details.",
      });
    }

    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
      return res.status(400).json({
        success: false,
        message: "Please either provide fixed salary or ranged salary.",
      });
    }

    if (salaryFrom && salaryTo && fixedSalary) {
      return res.status(400).json({
        success: false,
        message: "Cannot Enter Fixed and Ranged Salary together.",
      });
    }

    const postedBy = req.user.id;
    const job = await Job.create({
      title,
      description,
      category,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
      postedBy,
    });

    res.status(200).json({
      success: true,
      message: "Job Posted Successfully!",
      job,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
    console.log(error);
  }
};

const getMyJobs = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Candidate") {
      return res.status(400).json({
        success: false,
        message: "Candidate not allowed to access this resource.",
      });
    }

    const myJobs = await Job.find({ postedBy: req.user.id });
    res.status(200).json({
      success: true,
      myJobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// export const updateJob = async (req, res) => {
//   try {
//     const { role } = req.user;
//     if (role === "Candidate") {
//       return res.status(400).json({
//         success: false,
//         message: "Candidate not allowed to access this resource.",
//       });
//     }

//     const { id } = req.params;
//     let job = await Job.findById(id);
//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "OOPS! Job not found.",
//       });
//     }

//     job = await Job.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Job Updated!",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

const deleteJob = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Candidate") {
      return res.status(400).json({
        success: false,
        message: "Candidate not allowed to access this resource.",
      });
    }

    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "OOPS! Job not found.",
      });
    }

    await job.deleteOne();
    res.status(200).json({
      success: true,
      message: "Job Deleted!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// export const getSingleJob = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const job = await Job.findById(id);
//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found.",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       job,
//     });
//   } catch (error) {
//     res.status(404).json({ success: false, message: `Invalid ID / CastError` });
//   }
// };

module.exports = { getAllJobs, postJob, getMyJobs, deleteJob};