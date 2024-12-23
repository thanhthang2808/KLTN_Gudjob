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
    const userSkills = user.skills; // Giả định 'skills' là mảng kỹ năng của người dùng

    const { page = 1, limit = 9 } = req.query; // Lấy page và limit từ query parameters
    const skip = (page - 1) * limit;

    // Tìm các công việc có kỹ năng yêu cầu trùng với kỹ năng của người dùng
    const jobs = await Job.find({
      expired: false,
      status: "Approved",
      requiredSkills: { $in: userSkills },
    })
      .skip(skip)
      .limit(parseInt(limit));

    const totalJobs = await Job.countDocuments({
      expired: false,
      status: "Approved",
      requiredSkills: { $in: userSkills },
    });

    res.status(200).json({
      success: true,
      jobs,
      totalJobs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const getNumberOfJobs = async (req, res) => {
  try {
    const jobCount = await Job.countDocuments({ expired: false, status: "Approved" });
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
      vacancies,
      gender,
      description,
      requiredSkills,
      category,
      workType,
      level,
      experience,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
      applicationDeadline,
    } = req.body;

    // if (
    //   !title ||
    //   !vacancies ||
    //   !gender ||
    //   !description ||
    //   !requiredSkills ||
    //   !category ||
    //   !workType ||
    //   !level ||
    //   !experience ||
    //   !country ||
    //   !city ||
    //   !location
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Please provide full job details.",
    //   });
    // }

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
      vacancies,
      gender,
      description,
      requiredSkills,
      category,
      workType,
      level,
      experience,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
      applicationDeadline,
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

const getJobsPostedByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const jobs = await Job.find({ postedBy: id });
    res.status(200).json({
      success: true,
      jobs,
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
    const { searchQuery, selectedCategories, location, workType, page = 1, limit = 10 } = req.query;

    // Chuyển đổi tham số limit thành số nguyên
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Tính toán số lượng công việc cần bỏ qua (skip)
    const skip = (pageNumber - 1) * limitNumber;

    // Tạo đối tượng điều kiện tìm kiếm
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

    // Kiểm tra và áp dụng điều kiện tìm kiếm theo loại công việc
    if (workType && workType !== "Tất cả") {
      searchConditions.workType = workType;
    }

    // Các điều kiện mặc định (để lọc các công việc chưa hết hạn và đã được duyệt)
    searchConditions.status = "Approved";

    // Thực hiện tìm kiếm công việc trong cơ sở dữ liệu với phân trang
    const jobs = await Job.find(searchConditions)
      .skip(skip) // Bỏ qua các công việc theo trang
      .limit(limitNumber); // Giới hạn số lượng công việc trả về

    // Lấy tổng số công việc phù hợp với điều kiện tìm kiếm
    const totalJobs = await Job.countDocuments(searchConditions);

    // Tính tổng số trang
    const totalPages = Math.ceil(totalJobs / limitNumber);

    // Trả về kết quả tìm kiếm cùng với thông tin phân trang
    res.status(200).json({
      success: true,
      message: "Search Results",
      jobs,
      totalJobs,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const addToSavedJobs = async (req, res) => {
  try {
    const { jobId } = req.body;
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ success: false, message: "Job already saved" });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({ success: true, message: "Job saved successfully" });
    console.log("Job saved successfully");

  } catch (error) {

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const removeFromSavedJobs = async (req, res) => {
  try {
    const { jobId } = req.body;
    const { id } = req.user;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (!user.savedJobs.includes(jobId)) {
      return res.status(400).json({ success: false, message: "Job not saved" });
    }

    user.savedJobs = user.savedJobs.filter((savedJob) => savedJob.toString() !== jobId);

    await user.save();

    res.status(200).json({ success: true, message: "Job removed from saved jobs" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

const getSavedJobs = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).populate({
      path: 'savedJobs',
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const totalJobs = user.savedJobs.length;  // Get the total number of saved jobs

    res.status(200).json({
      success: true,
      savedJobs: user.savedJobs,
      totalJobs,
    });

  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
  addToSavedJobs,
  removeFromSavedJobs,
  getSavedJobs,
  getJobsPostedByUser,
};
