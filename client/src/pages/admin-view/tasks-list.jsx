import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    customId: "",
    employer: "",
    status: "",
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/task/get-all-tasks`, {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          ...filters,
        },
        withCredentials: true,
      });

      setTasks(data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
      }));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      console.error("Chi tiết lỗi:", error.response?.data || error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [pagination.current, filters]);

  const handleSearch = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, current: 1 })); // Reset trang khi thay đổi bộ lọc
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, current: newPage }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Danh sách công việc</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo Custom ID"
          className="px-4 py-2 border rounded w-1/3"
          onChange={(e) => handleSearch("customId", e.target.value)}
        />
        <select
          className="px-4 py-2 border rounded w-1/4"
          onChange={(e) => handleSearch("status", e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Approved">Đã duyệt</option>
          <option value="Denied">Từ chối</option>
          <option value="In Progress">Đang tiến hành</option>
        </select>
        <input
          type="text"
          placeholder="Tìm theo tên nhà tuyển dụng"
          className="px-4 py-2 border rounded w-1/3"
          onChange={(e) => handleSearch("employer", e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span>Đang tải...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white shadow-md rounded">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Custom ID</th>
                <th className="px-4 py-2">Tiêu đề</th>
                <th className="px-4 py-2">Tên công việc</th>
                <th className="px-4 py-2">Nhà tuyển dụng</th>
                <th className="px-4 py-2">Người thực hiện</th>
                <th className="px-4 py-2">Trạng thái</th>
                <th className="px-4 py-2">Số tiền thanh toán</th>
                <th className="px-4 py-2">Trạng thái thanh toán</th>
                <th className="px-4 py-2">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="border-b">
                  <td className="px-4 py-2">{task.customId}</td>
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2">{task.jobId?.title || "N/A"}</td>
                  <td className="px-4 py-2">{task.employerId?.companyName || "N/A"}</td>
                  <td className="px-4 py-2">{task.applicantId?.name || "N/A"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        task.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : task.status === "Denied"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">${task.payment?.amount || "0.00"}</td>
                  <td className="px-4 py-2">{task.payment?.status || "N/A"}</td>
                  <td className="px-4 py-2">{new Date(task.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-end mt-4">
        <button
          className={`px-4 py-2 mx-1 border rounded bg-gray-300 ${
            pagination.current === 1 ? "cursor-not-allowed opacity-25" : ""
          }`}
          disabled={pagination.current === 1}
          onClick={() => handlePageChange(pagination.current - 1)}
        >
          Trang trước
        </button>
        <span className="px-4 py-2">
          Trang {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
        </span>
        <button
          className={`px-4 py-2 mx-1 border rounded bg-gray-300 ${
            pagination.current === Math.ceil(pagination.total / pagination.pageSize)
              ? "cursor-not-allowed opacity-25"
              : ""
          }`}
          disabled={pagination.current === Math.ceil(pagination.total / pagination.pageSize)}
          onClick={() => handlePageChange(pagination.current + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default TaskList;