import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Briefcase, MapPin, Globe, Building2, Flag } from "lucide-react";
import { Rating } from "@mui/material";
import ReviewsModal from "@/components/ui/reviews-modal";
import { handleChat } from "@/services/chat-service";
import { ConfirmModal } from "@/components/ui/confirm-modal";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const CompanyInfo = () => {
  const { recruiterId } = useParams();
  const [recruiter, setRecruiter] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reportContent, setReportContent] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  // Fetch recruiter details
  const fetchRecruiterDetails = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/${recruiterId}`, {
        withCredentials: true,
      });
      setRecruiter(data.user);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin nhà tuyển dụng:", error);
    }
  };

  const handleReportAccount = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/report/report-user`,
        {
          reportedId: recruiterId,
          content: reportContent,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("Báo cáo tài khoản thành công!");
        setShowReportModal(false);
      }
    } catch (error) {
      console.error("Lỗi khi báo cáo tài khoản:", error);
      alert("Có lỗi xảy ra khi báo cáo tài khoản.");
    }
  };

  // Fetch jobs for the recruiter
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/job/jobs-postedby/${recruiterId}`,
        {
          withCredentials: true,
        }
      );
      setJobs(data.jobs);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách công việc:", error);
    }
  };

  // Fetch average rating
  const fetchAverageRating = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/review/get-average-rating/${recruiterId}`
      );
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error("Lỗi khi lấy điểm đánh giá trung bình:", error);
    }
  };

  const onClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchRecruiterDetails();
      await fetchJobs();
      await fetchAverageRating();
      setLoading(false);
    };
    fetchData();
  }, [recruiterId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium text-blue-600">
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  if (!recruiter) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium text-red-500">
          Không tìm thấy nhà tuyển dụng
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Thông tin nhà tuyển dụng */}
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          <img
            src={recruiter.avatar?.url || "/default-avatar.png"}
            alt={recruiter.companyName}
            className="w-32 h-32 rounded-full border-2 border-gray-300"
          />
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {recruiter.companyName}
            </h1>
            <p className="text-gray-600 text-sm">
              {recruiter.industry || "Chưa cập nhật ngành nghề"}
            </p>
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                {recruiter.address || "Chưa cập nhật địa chỉ"}
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-gray-400" />
                <a
                  href={recruiter.website || "#"}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {recruiter.website || "Chưa có website"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                {<div>{recruiter.numberOfEmployees}+ nhân viên </div> ||
                  "Chưa cập nhật quy mô"}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-yellow-500">
                  {averageRating.toFixed(1)}
                </span>
                <Rating
                  name="read-only"
                  value={averageRating}
                  readOnly
                  precision={0.5}
                  size="large"
                  sx={{ color: "#ffd700" }}
                />
                <span
                  className="text-blue-500 hover:underline cursor-pointer ml-3"
                  onClick={() => setOpenModal(true)}
                >
                  Xem đánh giá
                </span>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-3"
                  onClick={() => handleChat(recruiterId, navigate)}
                >
                  Nhắn tin
                </button>
                <Flag
                  className="w-5 h-5 text-gray-300 ml-2 cursor-pointer"
                  onClick={() => setShowReportModal(true)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal đánh giá */}
        {openModal && (
          <ReviewsModal revieweeId={recruiterId} onClose={onClose} />
        )}
        {showReportModal && (
          <ConfirmModal
            title="Báo cáo tài khoản"
            content={
              <div>
                <span>Nhập nội dung báo cáo vi phạm:</span>
                <input
                  type="reportContent"
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            }
            onClose={() => setShowReportModal(false)}
            onConfirm={handleReportAccount}
          />
        )}

        {/* Danh sách công việc */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Các công việc đang tuyển
          </h2>
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-gray-50 border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/candidate/job/${job._id}`)}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {job.fixedSalary
                      ? `${job.fixedSalary.toLocaleString()} VND/tháng`
                      : `${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()} VND/tháng`}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">Yêu cầu kỹ năng:</p>
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {job.requiredSkills?.length > 0 ? (
                      job.requiredSkills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))
                    ) : (
                      <li>Không yêu cầu kỹ năng cụ thể</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Hiện tại chưa có công việc nào được đăng tuyển.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;
