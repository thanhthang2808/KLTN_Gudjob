import React, { useState, useEffect } from 'react';
import axios from 'axios';
import anhmau from "@/assets/anhmau.png"; // Default avatar if not available
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [companyNames, setCompanyNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  // Fetch jobs and user details (company name, avatar)
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/job/getall`, {
          withCredentials: true,
        });
        const jobData = response.data.jobs;

        // Fetch user details for each job
        const userPromises = jobData.map((job) =>
          axios
            .get(`${API_URL}/api/user/${job.postedBy}`, { withCredentials: true })
            .then((userResponse) => {
              const avatarUrl = userResponse.data.user.avatar?.url || anhmau;
              const companyName = userResponse.data.user.companyName || "Company Name";
              return { id: job._id, avatar: avatarUrl, companyName: companyName };
            })
            .catch((error) => {
              console.error("Error fetching user details:", error);
              return { id: job._id, avatar: anhmau, companyName: "Company Name" };
            })
        );

        // Wait for all user details to be fetched
        const userData = await Promise.all(userPromises);
        const avatarMap = {};
        const companyMap = {};

        // Organize user data by job ID
        userData.forEach(({ id, avatar, companyName }) => {
          avatarMap[id] = avatar;
          companyMap[id] = companyName;
        });

        // Update state with jobs and user details
        setPosts(jobData);
        setAvatars(avatarMap);
        setCompanyNames(companyMap);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`${API_URL}/api/job/${id}/status`, { status: "Approved" }, { withCredentials: true });
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error approving job:", error);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/post/${id}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  // Filter posts based on search and status filter
  const filteredPosts = posts.filter((post) => {
    const matchesSearchQuery = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatusFilter = statusFilter ? post.status === statusFilter : true;
    return matchesSearchQuery && matchesStatusFilter;
  });

  // Sort posts by most recent date
  const sortedPosts = filteredPosts.sort((a, b) => {
    return new Date(b.jobPostedOn) - new Date(a.jobPostedOn); // Descending order (most recent first)
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý bài đăng</h1>
        <p className="text-gray-500">Duyệt, chỉnh sửa và xóa các bài đăng từ người dùng.</p>
      </header>

      {/* Search and Filter */}
      <div className="flex justify-between mb-6">
        {/* Search Bar */}
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Tìm kiếm công việc"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 w-full border rounded-lg"
          />
        </div>

        {/* Status Filter */}
        <div className="w-1/4">
          <select
            onChange={handleStatusFilterChange}
            value={statusFilter}
            className="p-2 w-full border rounded-lg"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Rejected">Từ chối</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Đang tải...</div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="px-6 py-4">Tiêu đề</th>
                <th className="px-6 py-4">Tác giả</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Ngày đăng</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedPosts.length > 0 ? (
                sortedPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-100 border-b">
                    <td className="px-6 py-4 font-medium text-gray-800">{post.title}</td>
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <img
                        src={avatars[post._id] || anhmau}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <span>{companyNames[post._id]}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{post.category}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(post.jobPostedOn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${post.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : post.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-500 hover:text-blue-600 mr-2" onClick={() => handleViewDetails(post._id)}>Chi tiết</button>
                      <button className="text-green-500 hover:text-green-600 mr-2" onClick={() => handleApprove(post._id)}>Duyệt</button>
                      <button className="text-red-500 hover:text-red-600">Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 py-4">
                    Không có bài đăng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PostManagement;
