import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function ApprovePosts() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách bài đăng với trạng thái "Pending"
  useEffect(() => {
    const fetchPendingJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/job/getpendingjobs`, {
          withCredentials: true,
        });
        setJobs(response.data.jobs);
      } catch (error) {
        console.error("Error fetching pending jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingJobs();
  }, []);

  // Hàm phê duyệt bài đăng
  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/job/${id}/status`,
        { status: "Approved" },
        { withCredentials: true }
      );
      setJobs(jobs.filter((job) => job._id !== id)); // Xóa bài đăng đã phê duyệt khỏi danh sách
    } catch (error) {
      console.error("Error approving job:", error);
    }
  };

  // Hàm từ chối bài đăng
  const handleReject = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/job/${id}/status`,
        { status: "Rejected" },
        { withCredentials: true }
      );
      setJobs(jobs.filter((job) => job._id !== id)); // Xóa bài đăng đã từ chối khỏi danh sách
    } catch (error) {
      console.error("Error rejecting job:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Duyệt bài đăng
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : jobs.length > 0 ? (
        jobs.map((job) => (
          <div
            key={job._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>{job.title}</h3>
              <p>{job.description}</p>
              <p>Đăng bởi: {job.postedBy}</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => handleApprove(job._id)}
                style={{
                  backgroundColor: "green",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                Phê duyệt
              </button>
              <button
                onClick={() => handleReject(job._id)}
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                Từ chối
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>Không có bài đăng nào cần duyệt.</p>
      )}
    </div>
  );
}

export default ApprovePosts;
