import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { RatingModal } from "@/components/ui/rating-modal";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // Bộ lọc trạng thái
  const [selectedTask, setSelectedTask] = useState(null); // Task đang chọn để hiển thị chi tiết
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  // Fetch danh sách task từ API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/task/get-tasks-by-recruiter`,
          {
            withCredentials: true,
          }
        );
        setTasks(response.data.tasks || []);
        setFilteredTasks(response.data.tasks || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách task:", error);
      }
    };
    fetchTasks();
  }, []);

  // Lọc task theo trạng thái
  useEffect(() => {
    if (statusFilter === "") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === statusFilter));
    }
  }, [statusFilter, tasks]);

  // Xử lý khi chọn trạng thái
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Hiển thị modal chi tiết
  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleApproveTask = async (task) => {
    try {
      await axios.post(
        `${API_URL}/api/task/approve-task`,
        { taskId: task._id },
        { withCredentials: true }
      );
      alert("Task approved successfully!");
      try {
        await axios.put(
          `${API_URL}/api/wallet/pay-for-task`,
          {
            amount: task.payment.amount,
            employerId: task.employerId,
            applicantId: task.applicantId._id,
            customId: task.customId,
          },
          { withCredentials: true }
        );
        console.log(
          task.employerId
        );
        console.log(task.applicantId);
      } catch (paidErr) {
        console.error("Failed to execute payment:", paidErr.message);
        alert(
          "Task approved but failed to execute payment. Please contact support."
        );
      }
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      alert("Error approve task: " + err.message);
    }
  };

  const handleRejectTask = async (task) => {
    try {
      await axios.post(
        `${API_URL}/api/task/reject-task`,
        { taskId: task._id },
        { withCredentials: true }
      );
      alert("Task rejected successfully!");
      try {
        await axios.put(
          `${API_URL}/api/wallet/unlock-wallet-balance`,
          { amount: task.payment.amount, userId: task.employerId, customId: task.customId },
          { withCredentials: true }
        );
        console.log(
          "Refunded",
          task.payment.amount,
          "to employer",
          task.employerId
        );
      } catch (refundError) {
        console.error("Failed to refund payment:", refundError.message);
        alert(
          "Task rejected but failed to refund payment. Please contact support."
        );
      }
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      alert("Error reject task: " + err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Quản lý Task
      </h1>

      {/* Bộ lọc trạng thái */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Lọc theo trạng thái:
        </label>
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="p-3 border border-gray-300 rounded-lg shadow-md w-full md:w-1/3 focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả</option>
          <option value="Assigned">Đã tạo</option>
          <option value="In Progress">Đang thực hiện</option>
          <option value="Submitted">Ứng viên hoàn thành</option>
          <option value="Overdue">Quá hạn</option>
          <option value="Approved">Đã duyệt</option>
          <option value="Rejected">Đã từ chối</option>
          <option value="Denied">Đã hủy</option>
        </select>
      </div>

      {/* Danh sách task */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="border pt-2 pb-4 px-4 rounded-xl shadow-lg transition-all hover:shadow-xl"
          >
            <p className="text-xs text-gray-500">#{task.customId || "N/A"}</p>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {task.title}
            </h3>
            <p className="text-gray-600">Trạng thái: {task.status}</p>
            <p className="text-gray-600">Ứng viên: {task.applicantId.name}</p>
            <p className="text-gray-600">
              Bắt đầu: {new Date(task.startDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              Số tiền: {task.payment.amount.toLocaleString()} VND
            </p>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handleViewDetails(task)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Xem chi tiết
              </button>
              {task.status === "Submitted" && (
                <button
                  onClick={() => handleApproveTask(task)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Phê duyệt
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal chi tiết */}
      {isModalOpen && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
          onApprove={handleApproveTask}
          onReject={handleRejectTask}
        />
      )}
    </div>
  );
};

export default TaskManager;

const TaskDetailsModal = ({ task, onClose, onApprove, onReject }) => {
  if (!task) return null;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl">
        <div className="relative">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {task.title}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-6">
          <div className="flex justify-between">
            <span className="text-gray-700">Tên bài đăng:</span>
            <span className="text-gray-500">{task.jobId.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Mô tả:</span>
            <p className="text-gray-500">{task.description}</p>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Trạng thái:</span>
            <span
              className={`text-${
                task.status === "Completed" ? "green" : "red"
              }-500`}
            >
              {task.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Ứng viên:</span>
            <span className="text-gray-500">{task.applicantId.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Số tiền:</span>
            <div>
              <span className="text-gray-500">{task.payment.status}</span>
              <span className="text-gray-500 ml-2">
                {task.payment.amount.toLocaleString()} VND
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Hạn chót:</span>
            <span className="text-gray-500">
              {new Date(task.deadline).toLocaleDateString()}
            </span>
          </div>

          {/* Files và submission content */}
          {task.submission.content && (
            <div>
              <strong className="text-gray-700">Kết quả:</strong>{" "}
              {task.submission.content}
            </div>
          )}
          {task.submission.files && task.submission.files.length > 0 && (
            <div>
              <strong className="text-gray-700">Files:</strong>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                {task.submission.files.map((file, index) => (
                  <li key={index}>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      className="text-blue-600 hover:underline transition-all duration-200"
                    >
                      {file.fileName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nút phê duyệt và từ chối */}
          {task.status === "Submitted" && (
            <div className="flex justify-between mt-6">
              <button
                onClick={() => onApprove(task)}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Phê duyệt
              </button>
              <button
                onClick={() => onReject(task)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Từ chối
              </button>
            </div>
          )}
          {task.status === "Approved" && (
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700"
              >
                Đánh giá ứng viên
              </button>
            </div>
          )}
          {isReviewModalOpen && (
        <RatingModal
          revieweeId={task.applicantId}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
        </div>
      </div>
    </div>
  );
};
