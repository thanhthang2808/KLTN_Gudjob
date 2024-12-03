import React, { useEffect, useState } from "react";
import axios from "axios";

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
        const response = await axios.get(`${API_URL}/api/task/get-tasks-by-recruiter`, {
          withCredentials: true,
        });
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Quản lý Task</h1>

      {/* Bộ lọc trạng thái */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Lọc theo trạng thái:</label>
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="p-2 border rounded w-full md:w-1/3"
        >
          <option value="">Tất cả</option>
          <option value="Assigned">Đã tạo</option>
          <option value="In Progress">Đang thực hiện</option>
          <option value="Completed">Ứng viên hoàn thành</option>
          <option value="Approved">Đã duyệt</option>
          <option value="Rejected">Đã hủy</option>
          <option value="Paid">Đã thanh toán</option>
        </select>
      </div>

      {/* Danh sách task */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task._id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p>Trạng thái: {task.status}</p>
            <p>Ứng viên: {task.applicantId.name}</p>
            <p>Bắt đầu: {new Date(task.startDate).toLocaleDateString()}</p>
            <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            <p>Số tiền: {task.payment.amount.toLocaleString()} VND</p>
            <button
              onClick={() => handleViewDetails(task)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
            >
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>

      {/* Modal chi tiết */}
      {isModalOpen && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskManager;

const TaskDetailsModal = ({ task, onClose }) => {
    if (!task) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          <h2 className="text-xl font-bold mb-4">{task.title}</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          <div className="space-y-4">
          <div>
              <strong>Tên bài đăng:</strong> {task.jobId.title}
            </div>
            <div>
              <strong>Mô tả:</strong> {task.description}
            </div>
            <div>
              <strong>Trạng thái:</strong> {task.status}
            </div>
            <div>
              <strong>Ứng viên:</strong> {task.applicantId.name}
            </div>
            <div>
              <strong>Số tiền:</strong> {task.payment.amount.toLocaleString()} VND
            </div>
            <div>
              <strong>Hạn chót:</strong> {new Date(task.deadline).toLocaleDateString()}
            </div>
            <div>
              <strong>Phản hồi:</strong> {task.feedback?.comment || "Chưa có phản hồi"}
            </div>
          </div>
        </div>
      </div>
    );
  };