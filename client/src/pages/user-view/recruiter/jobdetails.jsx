import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const RecruiterJobDetails = () => {
  const { id } = useParams(); // Lấy ID công việc từ URL
  const [job, setJob] = useState(null);

  console.log(id);
  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/job/${id}`, {
          withCredentials: true,
        });
        setJob(data.job);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Không thể tải thông tin công việc!"
        );
      }
    };
    fetchJobDetails();
  }, [id]);

  if (!job) {
    return <p>Đang tải thông tin công việc...</p>;
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  return (
    <div className="job-details page bg-gray-100 min-h-screen mt-10 p-5">
      <div className="container mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">{job.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          Ngày đăng: {formatDate(job.jobPostedOn)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Thông tin công việc</h2>
            <ul className="space-y-2">
              <li>
                <strong>Danh mục:</strong> {job.category}
              </li>
              <li>
                <strong>Trình độ:</strong> {job.level}
              </li>
              <li>
                <strong>Kinh nghiệm yêu cầu:</strong> {job.experience}
              </li>
              <li>
                <strong>Số lượng tuyển:</strong> {job.vacancies}
              </li>
              <li>
                <strong>Hình thức làm việc:</strong> {job.workType}
              </li>
              <li>
                <strong>Giới tính yêu cầu:</strong> {job.gender}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Địa điểm và Lương</h2>
            <ul className="space-y-2">
              <li>
                <strong>Địa chỉ:</strong> {job.location}, {job.city},{" "}
                {job.country}
              </li>
              <li>
                <strong>Lương:</strong>{" "}
                {job.fixedSalary
                  ? `${job.fixedSalary.toLocaleString()} VNĐ`
                  : `${job.salaryFrom?.toLocaleString()} VNĐ - ${job.salaryTo?.toLocaleString()} VNĐ`}
              </li>
              <li>
                <strong>Hạn nộp hồ sơ:</strong>{" "}
                {job.applicationDeadline
                  ? formatDate(job.applicationDeadline)
                  : "Không có"}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Mô tả công việc</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Kỹ năng yêu cầu</h2>
          {job.requiredSkills.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {job.requiredSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Không yêu cầu kỹ năng đặc biệt.</p>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Trạng thái</h2>
          <p
            className={`text-sm font-semibold ${
              job.status === "Pending"
                ? "text-yellow-500"
                : job.status === "Approved"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {job.status}
          </p>
        </div>

        <div className="mt-10 text-right">
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterJobDetails;
