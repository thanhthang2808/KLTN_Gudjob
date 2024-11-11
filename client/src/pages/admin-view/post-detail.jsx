import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import anhmau from '@/assets/anhmau.png'; // Default avatar

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function PostDetail() {
  const { id } = useParams(); // Get job ID from URL params
  const [job, setJob] = useState(null);
  const [postedBy, setPostedBy] = useState(null); // Store the postedBy user data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const jobResponse = await axios.get(`${API_URL}/api/job/${id}`, {
          withCredentials: true,
        });
        setJob(jobResponse.data.job);

        // Fetch user details for the postedBy field
        const userResponse = await axios.get(`${API_URL}/api/user/${jobResponse.data.job.postedBy}`, {
          withCredentials: true,
        });
        setPostedBy(userResponse.data.user);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Could not fetch job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [id]);

  const handleApprove = async () => {
    try {
      await axios.put(`${API_URL}/api/job/${id}/status`, { status: 'Approved' }, { withCredentials: true });
      setJob((prevJob) => ({ ...prevJob, status: 'Approved' }));
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  const handleReject = async () => {
    try {
      await axios.put(`${API_URL}/api/job/${id}/status`, { status: 'Rejected' }, { withCredentials: true });
      setJob((prevJob) => ({ ...prevJob, status: 'Rejected' }));
    } catch (error) {
      console.error("Error updating job status:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chi tiết bài đăng</h1>
        <p className="text-gray-500">Thông tin chi tiết về công việc này.</p>
      </header>

      {job && postedBy ? (
        <div className="bg-white shadow rounded-lg p-6">
          {/* Job Title and User Information */}
          <div className="flex items-center mb-6">
            <img
              src={postedBy.avatar || anhmau}
              alt="Company Avatar"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{postedBy.companyName || 'Company Name'}</p>
            </div>
          </div>

          {/* Job Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Mô tả công việc</h3>
            <p className="text-gray-600">{job.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Chi tiết công việc</h3>
            <p><strong>Category:</strong> {job.category}</p>
            <p><strong>Location:</strong> {job.city}, {job.country}</p>
            <p><strong>Salary:</strong> {job.fixedSalary ? `${job.fixedSalary} VNĐ` : `${job.salaryFrom}-${job.salaryTo} VNĐ`}</p>
            <p><strong>Application Deadline:</strong> {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : "Not Set"}</p>
            <p><strong>Experience Required:</strong> {job.experience || "Any"}</p>
            <p><strong>Level:</strong> {job.level}</p>
            <p><strong>Vacancies:</strong> {job.vacancies}</p>
            <p><strong>Work Type:</strong> {job.workType}</p>
          </div>

          {/* Status and Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Trạng thái bài đăng</h3>
            <p className={`px-4 py-2 rounded-full text-center text-sm ${job.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : job.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {job.status}
            </p>
          </div>

          {/* Action Buttons */}
          {job.status === "Pending" && (
            <div className="flex space-x-4">
              <button onClick={handleApprove} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Duyệt</button>
              <button onClick={handleReject} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Từ chối</button>
            </div>
          )}

          <button
            onClick={() => navigate("/admin/post-manager")}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Quay lại danh sách
          </button>
        </div>
      ) : (
        <p>Không có thông tin chi tiết bài đăng.</p>
      )}
    </div>
  );
}

export default PostDetail;
