const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    // Công việc liên quan đến nhiệm vụ
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true,
        },

    // Ứng viên được giao nhiệm vụ
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Nhà tuyển dụng tạo nhiệm vụ
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customId: {
        type: Number,
        unique: true,
        trim: true,
      },

    // Tiêu đề nhiệm vụ
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Mô tả chi tiết
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // Trạng thái nhiệm vụ
    status: {
      type: String,
      enum: ["Assigned", "Denied", "In Progress", "Submitted", "Overdue", "Approved", "Rejected"],
      default: "Assigned",
    },

    // Ngày bắt đầu và ngày kết thúc
    startDate: {
      type: Date,
    },
    deadline: {
      type: Date,
      required: true,
    },

    // Tài liệu hoặc file đính kèm (nếu có)
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],

    // Kết quả công việc
    submission: {
      // Nội dung do ứng viên nộp
      content: String,

      // File do ứng viên nộp
      files: [
        {
          fileName: String,
          fileUrl: String,
        },
      ],

      // Thời gian nộp kết quả
      submittedAt: Date,
    },

    // Phản hồi của nhà tuyển dụng
    feedback: {
      comment: String,
      rating: {
        type: Number, // Đánh giá theo thang điểm (ví dụ: 1-5)
        min: 1,
        max: 5,
      },
    },

    // Thanh toán cho nhiệm vụ
    payment: {
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "",
      },
      paidAt: Date,
    },
  },
  {
    timestamps: true, // Tự động tạo trường createdAt và updatedAt
  }
);

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
