import React, { useState, useEffect } from "react";
import axios from "axios";
import anhmau from "@/assets/anhmau.png"; // Default avatar if not available
import { useNavigate } from "react-router-dom";
import { Check, Text, Trash2, X } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function PostManagement() {
  const [posts, setPosts] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [companyNames, setCompanyNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/job/getall`, {
          withCredentials: true,
        });
        const jobData = response.data.jobs;

        const userPromises = jobData.map((job) =>
          axios
            .get(`${API_URL}/api/user/${job.postedBy}`, {
              withCredentials: true,
            })
            .then((userResponse) => {
              const avatarUrl = userResponse.data.user.avatar?.url || anhmau;
              const companyName =
                userResponse.data.user.companyName || "Company Name";
              return {
                id: job._id,
                avatar: avatarUrl,
                companyName: companyName,
              };
            })
            .catch((error) => {
              console.error("Error fetching user details:", error);
              return {
                id: job._id,
                avatar: anhmau,
                companyName: "Company Name",
              };
            })
        );

        const userData = await Promise.all(userPromises);
        const avatarMap = {};
        const companyMap = {};

        userData.forEach(({ id, avatar, companyName }) => {
          avatarMap[id] = avatar;
          companyMap[id] = companyName;
        });

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
      await axios.put(
        `${API_URL}/api/job/${id}/status`,
        { status: "Approved" },
        { withCredentials: true }
      );
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error approving job:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/job/${id}/status`,
        { status: "Rejected" },
        { withCredentials: true }
      );
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error rejecting job:", error);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/post/${id}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleStatusFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filteredPosts = posts.filter((post) => {
    const searchTarget = `${post.title} ${companyNames[post._id]}`.toLowerCase();
    const matchesSearch = searchTarget.includes(searchQuery);
    const matchesStatus = filterStatus ? post.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    return sortOrder === "asc"
      ? new Date(a.jobPostedOn) - new Date(b.jobPostedOn)
      : new Date(b.jobPostedOn) - new Date(a.jobPostedOn);
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý bài đăng</h1>
        <p className="text-gray-500">
          Duyệt, chỉnh sửa và xóa các bài đăng từ người dùng.
        </p>
      </header>

      <div className="flex justify-between mb-6">
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Tìm kiếm theo công việc hoặc công ty"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 w-full border rounded-lg"
          />
        </div>

        <div className="w-1/4">
          <select
            onChange={handleStatusFilterChange}
            value={filterStatus}
            className="p-2 w-full border rounded-lg"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Pending">Đang chờ</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Rejected">Đã từ chối</option>
          </select>
        </div>

        <div className="w-1/4">
          <select
            onChange={handleSortOrderChange}
            value={sortOrder}
            className="p-2 w-full border rounded-lg"
          >
            <option value="desc">Sắp xếp theo ngày: Mới nhất</option>
            <option value="asc">Sắp xếp theo ngày: Cũ nhất</option>
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
              {currentPosts.length > 0 ? (
                currentPosts.map((post) => (
                  <tr key={post._id} className="hover:bg-gray-100 border-b">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {post.title}
                    </td>
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
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          post.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : post.status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-2 py-1">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          className="flex items-center bg-white justify-center px-3 py-1 text-sm font-medium text-blue-500 border border-blue-500 rounded hover:bg-blue-500 hover:text-white transition-colors duration-200"
                          onClick={() => handleViewDetails(post._id)}
                        >
                          <Text />
                          <span className="ml-1">View</span>
                        </button>
                        {post.status === "Pending" && (
                          <div className="flex items-center justify-center space-x-2">
                            <button
                            className="flex items-center bg-white justify-center px-3 py-1 text-sm font-medium text-green-500 border border-green-500 rounded hover:bg-green-500 hover:text-white transition-colors duration-200"
                            onClick={() => handleApprove(post._id)}
                          >
                            <Check />
                          </button>
                          <button
                            className="flex items-center bg-white justify-center px-3 py-1 text-sm font-medium text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                            onClick={() => handleReject(post._id)}
                          >
                            <X />
                          </button>
                          </div>
                        )}
                        {post.status !== "Pending" && (
                          <div className="flex items-center justify-center space-x-2">
                            <button
                            className="flex items-center bg-white justify-center px-3 py-1 text-sm font-medium text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition-colors duration-200"
                            onClick={() => handleReject(post._id)}
                          >
                            <Trash2 />
                          </button>
                          </div>
                        )}
                      </div>
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

      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
        >
          Trang trước
        </button>
        <span className="text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-50"
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}

export default PostManagement;
