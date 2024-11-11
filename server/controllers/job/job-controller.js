const User = require("../../models/User");
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

//Recommend Jobs
const getAllRecommendJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    console.log("userId", user);
    const userSkills = user.skills; // Giả định 'skills' là mảng kỹ năng của người dùng

    // Tìm các công việc có kỹ năng yêu cầu trùng với kỹ năng của người dùng
    const jobs = await Job.find({
      expired: false,
      requiredSkills: { $in: userSkills },
    });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getNumberOfJobs = async (req, res) => {
  try {
    const jobCount = await Job.countDocuments({ expired: false });
    res.status(200).json({
      success: true,
      count: jobCount,
    });
    console.log(jobCount);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getPendingJobs = async (req, res) => {
  try {
    const pendingJobs = await Job.find({ status: "Pending" });
    res.status(200).json({ success: true, jobs: pendingJobs });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to retrieve pending jobs",
        error,
      });
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
      requiredSkills,
      category,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
    } = req.body;

    if (
      !title ||
      !description ||
      !requiredSkills ||
      !category ||
      !country ||
      !city ||
      !location
    ) {
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
      requiredSkills,
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

const getSingleJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: `Invalid ID / CastError` });
  }
};
const updateJobStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expect "Approved" or "Rejected" in the request body

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const job = await Job.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: `Job ${status.toLowerCase()} successfully`,
        job,
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update job status", error });
  }
};

const getSearchResults = async (req, res) => {
  try {
    const { searchQuery, selectedCategories, location } = req.query;

    // Tạo một đối tượng điều kiện tìm kiếm
    const searchConditions = {};

    // Kiểm tra và áp dụng điều kiện tìm kiếm theo tiêu đề công việc
    if (searchQuery && searchQuery.trim()) {
      searchConditions.title = { $regex: searchQuery, $options: "i" }; // Tìm kiếm không phân biệt chữ hoa/thường
    }

    // Kiểm tra và áp dụng điều kiện tìm kiếm theo các danh mục
    if (selectedCategories && selectedCategories.length > 0) {
      searchConditions.category = { $in: selectedCategories.split(",") }; // Chuyển đổi chuỗi danh mục thành mảng
    }

    // Kiểm tra và áp dụng điều kiện tìm kiếm theo địa điểm
    if (location && location !== "Khác") {
      searchConditions.city = location;
    }

    // Thực hiện tìm kiếm công việc trong cơ sở dữ liệu
    const jobs = await Job.find(searchConditions);

    res.status(200).json({
      success: true,
      message: "Search Results",
      jobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllJobs,
  getAllRecommendJobs,
  postJob,
  getMyJobs,
  deleteJob,
  getSingleJob,
  getNumberOfJobs,
  getSearchResults,
  getPendingJobs,
  updateJobStatus,
};
