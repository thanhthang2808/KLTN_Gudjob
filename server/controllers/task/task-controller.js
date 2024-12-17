const Job = require("../../models/Job");
const Application = require("../../models/Application");
const Task = require("../../models/Task");

const generateUniqueId = async () => {
  let uniqueId = Math.floor(10000000 + Math.random() * 90000000); 

  const existingTask = await Task.findOne({ customId: uniqueId });
  if (existingTask) {
    return generateUniqueId(); 
  }

  return uniqueId;
};

const createTaskAndAssign = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Candidate") {
      return res.status(400).json({
        success: false,
        message: "Candidate not allowed to access this resource.",
      });
    }

    const {
      applicationId,
      title,
      description,
      deadline,
      paymentAmount,
    } = req.body;

    const employerId = req.user.id;

    // Kiểm tra các trường bắt buộc
    if (!applicationId || !title || !description || !deadline) {
      return res.status(400).json({ message: "Thiếu thông tin cần thiết!" });
    }

    // Xác thực applicationId
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Không tìm thấy ứng tuyển!" });
    }

    // Kiểm tra ứng viên từ Application
    const applicant = application.applicantID.user;
    const jobId = application.jobID;


    const customId = await generateUniqueId();

    // Tạo task
    const newTask = new Task({
      jobId,
      applicationId,
      applicantId: applicant._id,
      employerId,
      title,
      description,
      deadline,
      customId,
      payment: {
        amount: paymentAmount || 0, // Giá trị mặc định nếu không có
        status: "Pending",
      },
    });

    // Lưu task vào database
    await newTask.save();

    // Phản hồi thành công
    res.status(201).json({
      message: "Tạo nhiệm vụ thành công và đã gán cho ứng viên!",
      task: newTask,
    });
  } catch (error) {
    console.error("Lỗi khi tạo nhiệm vụ:", error);
    res
      .status(500)
      .json({ message: "Có lỗi xảy ra trong quá trình tạo nhiệm vụ!" });
  }
};

const getASingeTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin task
    const task = await Task.findById(id)
      .populate("jobId")
      .populate("applicantId");

    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy task!" });
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin task:", error);
    res.status(500).json({ message: "Có lỗi khi lấy thông tin task!" });
  }
};

const getMyTaskByRecruiter = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Candidate") {
      return res.status(400).json({
        success: false,
        message: "Candidate not allowed to access this resource.",
      });
    }

    const employerId = req.user.id;

    // Lấy danh sách task theo nhà tuyển dụng
    const tasks = await Task.find({ employerId })
      .populate("jobId")
      .populate("applicantId");

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách task:", error);
    res.status(500).json({ message: "Có lỗi khi lấy danh sách task!" });
  }
}

const getMyTaskByCandidate = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Recruiter") {
      return res.status(400).json({
        success: false,
        message: "Recruiter not allowed to access this resource.",
      });
    }

    const applicantId = req.user.id;

    // Lấy danh sách task theo ứng viên
    const tasks = await Task.find({
      applicantId,
    })
      .populate("jobId")
      .populate("employerId");

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách task:", error);
    res.status(500).json({ message: "Có lỗi khi lấy danh sách task!" });
  }
}


const acceptTaskByCandidate = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Recruiter") {
      return res.status(400).json({
        success: false,
        message: "Recruiter not allowed to access this resource.",
      });
    }

    const { taskId } = req.body;
    const { user } = req;

    // Lấy thông tin task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy task!" });
    }

    // Kiểm tra xem task có phải của ứng viên không
    if (task.applicantId.toString() !== user.id) {
      return res.status(403).json({ message: "Không thể thực hiện hành động này!" });
    }

    // Cập nhật trạng thái task
    task.payment.status = "Pending";
    task.status = "In Progress";
    task.startDate = new Date(Date.now());
    await task.save();

    res.status(200).json({ message: "Đã chấp nhận nhiệm vụ!" });
  }
  catch (error) {
    console.error("Lỗi khi chấp nhận task:", error);
    res.status(500).json({ message: "Có lỗi khi chấp nhận task!" });
  }
}

const denyTaskByCandidate = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Recruiter") {
      return res.status(400).json({
        success: false,
        message: "Recruiter not allowed to access this resource.",
      });
    }

    const { taskId } = req.body;
    const { user } = req;

    // Lấy thông tin task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy task!" });
    }

    // Kiểm tra xem task có phải của ứng viên không
    if (task.applicantId.toString() !== user.id) {
      return res.status(403).json({ message: "Không thể thực hiện hành động này!" });
    }

    // Cập nhật trạng thái task
    task.payment.status = "Failed";
    task.status = "Denied";
    await task.save();

    res.status(200).json({ message: "Đã từ chối nhiệm vụ!" });

  } catch (error) {
    console.error("Lỗi khi từ chối task:", error);
    res.status(500).json({ message: "Có lỗi khi từ chối task!" });
  }
}

const submitTaskByCandidate = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Recruiter") {
      return res.status(400).json({
        success: false,
        message: "Recruiter not allowed to access this resource.",
      });
    }

    const { taskId } = req.body;
    const { submission } = req.body;
    const { user } = req;

    // Lấy thông tin task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy task!" });
    }

    // Kiểm tra xem task có phải của ứng viên không
    if (task.applicantId.toString() !== user.id) {
      return res.status(403).json({ message: "Không thể thực hiện hành động này!" });
    }

    // Cập nhật trạng thái task
    task.status = "Submitted";
    task.submission = {
      content: submission.content,
      files: submission.files,
      submittedAt: new Date(Date.now()),
    };
    await task.save();

    res.status(200).json({ message: "Đã nộp nhiệm vụ thành công!" });

  } catch (error) {
    console.error("Lỗi khi submit task:", error);
    res.status(500).json({ message: "Có lỗi khi submit task!" });
  }
}

const approveTaskByRecruiter = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Candidate") {
      return res.status(400).json({
        success: false,
        message: "Candidate not allowed to access this resource.",
      });
    }

    const { taskId } = req.body;
    const { user } = req;

    // Lấy thông tin task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy task!" });
    }

    if (task.employerId.toString() !== user.id) {
      return res.status(403).json({ message: "Không thể thực hiện hành động này!" });
    }

    // Cập nhật trạng thái task
    task.payment.status = "Paid";
    task.status = "Approved";
    await task.save();

    res.status(200).json({ message: "Phê duyệt thành công!" });

  } catch (error) {
    console.error("Lỗi khi phê duyệt bài nộp:", error);
    res.status(500).json({ message: "Có lỗi khi phê duyệt task!" });
  }
}

const rejectTaskByRecruiter = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Candidate") {
      return res.status(400).json({
        success: false,
        message: "Candidate not allowed to access this resource.",
      });
    }

    const { taskId } = req.body;
    const { user } = req;

    // Lấy thông tin task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy task!" });
    }

    if (task.employerId.toString() !== user.id) {
      return res.status(403).json({ message: "Không thể thực hiện hành động này!" });
    }

    // Cập nhật trạng thái task
    task.payment.status = "Failed";
    task.status = "Rejected";
    await task.save();

    res.status(200).json({ message: "Từ chối bài nộp thành công!" });

  } catch (error) {
    console.error("Lỗi khi từ chối bài nộp:", error);
    res.status(500).json({ message: "Có lỗi khi từ chối task!" });
  }
}

const deleteTaskByRecruiter = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Candidate") {
      return res.status(400).json({
        success: false,
        message: "Candidate not allowed to access this resource.",
      });
    }

    const { taskId } = req.params;

    // Lấy thông tin task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Không tìm thấy task!" });
    }

    // Kiểm tra xem task có phải của nhà tuyển dụng không
    if (task.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Không thể thực hiện hành động này!" });
    }

    // Xóa task
    await task.remove();

    res.status(200).json({ message: "Đã xóa task!" });
  }
  catch (error) {
    console.error("Lỗi khi xóa task:", error);
    res.status(500).json({ message: "Có lỗi khi xóa task!" });
  }

}

const getAllTaskByAdmin = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "Admin") {
      return res.status(400).json({
        success: false,
        message: "Admin is required to access this resource.",
      });
    }

    const { page = 1, limit = 20, customId, employer, status, sort = "-createdAt" } = req.query;

    // Tạo bộ lọc
    const filters = {};
    if (customId) {
      filters.customId = Number(customId);
    }
    if (employer) {
      filters["employerId.companyName"] = { $regex: employer, $options: "i" }; // Tìm kiếm theo tên nhà tuyển dụng
    }
    if (status) {
      filters.status = status;
    }

    const tasks = await Task.find(filters)
      .populate("jobId", "title")
      .populate("applicantId", "name")
      .populate("employerId", "companyName avatar")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalTasks = await Task.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        total: totalTasks,
        currentPage: Number(page),
        totalPages: Math.ceil(totalTasks / limit),
      },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách task:", error);
    res.status(500).json({ message: "Có lỗi khi lấy danh sách task!" });
  }
};


module.exports = { createTaskAndAssign, getMyTaskByRecruiter, acceptTaskByCandidate, denyTaskByCandidate, deleteTaskByRecruiter, getMyTaskByCandidate, getASingeTask, submitTaskByCandidate, approveTaskByRecruiter, rejectTaskByRecruiter, getAllTaskByAdmin };
