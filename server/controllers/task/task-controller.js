const Job = require("../../models/Job");
const Application = require("../../models/Application");
const Task = require("../../models/Task");

// Tạo task và gán cho ứng viên
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



    // Tạo task
    const newTask = new Task({
      jobId,
      applicationId,
      applicantId: applicant._id,
      employerId,
      title,
      description,
      deadline,
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

const acceptTaskByCandidate = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Recruiter") {
      return res.status(400).json({
        success: false,
        message: "Recruiter not allowed to access this resource.",
      });
    }

    const { taskId } = req.params;
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
    task.payment.status = "Accepted";
    await task.save();

    res.status(200).json({ message: "Đã chấp nhận nhiệm vụ!" });
  }
  catch (error) {
    console.error("Lỗi khi chấp nhận task:", error);
    res.status(500).json({ message: "Có lỗi khi chấp nhận task!" });
  }
}

const rejectTaskByCandidate = async (req, res) => {
  try {
    const { role } = req.user;
    if (role === "Recruiter") {
      return res.status(400).json({
        success: false,
        message: "Recruiter not allowed to access this resource.",
      });
    }

    const { taskId } = req.params;
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
    task.payment.status = "Rejected";
    await task.save();

    res.status(200).json({ message: "Đã từ chối nhiệm vụ!" });

  } catch (error) {
    console.error("Lỗi khi từ chối task:", error);
    res.status(500).json({ message: "Có lỗi khi từ chối task!" });
  }
}


module.exports = { createTaskAndAssign, getMyTaskByRecruiter, acceptTaskByCandidate, rejectTaskByCandidate };
