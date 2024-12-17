import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function ReportManager() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/report/get-all-reports`, {
          withCredentials: true,
        });
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await axios.delete(`${API_URL}/api/report/delete-report/${reportId}`, {
        withCredentials: true,
      });
      setReports(reports.filter((report) => report._id !== reportId));
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý báo cáo</h1>
        <p className="text-gray-500">Danh sách các tài khoản bị báo cáo vi phạm.</p>
      </header>

      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4">Người báo cáo</th>
                <th className="px-6 py-4">Bị báo cáo</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Nội dung báo cáo</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.length > 0 ? (
                currentReports.map((report) => (
                  <tr key={report._id} className="hover:bg-gray-100 border-b">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {report.reporter.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {report.reportedUser.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {report.reportedUser.role}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{report.content}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteReport(report._id)}
                        className="text-red-500 hover:text-white hover:bg-red-500 bg-white border border-red-500 px-2 py-1 rounded"
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    Không có báo cáo nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-500 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Trước
            </button>
            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-500 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportManager;
