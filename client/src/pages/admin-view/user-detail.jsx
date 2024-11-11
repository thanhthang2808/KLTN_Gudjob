import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Unlock, Trash, Edit } from "lucide-react"; // Importing icons

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function UserDetail() {
  const { id } = useParams(); // Get the userId from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/${id}`, {
          withCredentials: true,
        });
        setUser(response.data.user);
      } catch (err) {
        setError("Could not fetch user details.");
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleLockAccount = async (status) => {
    try {
      const newStatus = status === "locked" ? "active" : "locked";
      await axios.put(
        `${API_URL}/api/user/lock/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setUser({ ...user, status: newStatus });
    } catch (err) {
      console.error("Error updating account status:", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${API_URL}/api/user/${id}`, {
        withCredentials: true,
      });
      navigate("/admin/list-users"); // Navigate back to the user list after deletion
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  const handleEditAccount = () => {
    navigate(`/admin/user-edit/${id}`);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Chi tiết người dùng
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
          <div>
            {user.status === "locked" ? (
              <button
                onClick={() => handleLockAccount(user.status)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Unlock className="inline-block mr-2" /> Mở khóa
              </button>
            ) : (
              <button
                onClick={() => handleLockAccount(user.status)}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                <Lock className="inline-block mr-2" /> Khóa
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xl font-semibold">Thông tin chi tiết</h3>
            <p className="text-gray-500"><strong>Role:</strong> {user.role}</p>
            {user.role !== "Admin" && (
              <p className="text-gray-500"><strong>Status:</strong> {user.status === "locked" ? "Locked" : "Active"}</p>
            )}
            <p className="text-gray-500"><strong>Phone:</strong> {user.phone || "N/A"}</p>
            <p className="text-gray-500"><strong>Description:</strong> {user.description || "N/A"}</p>
          </div>

          {user.role === "Recruiter" && (
            <div>
              <h3 className="text-xl font-semibold">Thông tin nhà tuyển dụng</h3>
              <p className="text-gray-500"><strong>Công ty:</strong> {user.companyName}</p>
              <p className="text-gray-500"><strong>Website:</strong> {user.website || "N/A"}</p>
              <p className="text-gray-500"><strong>Địa chỉ:</strong> {user.address}</p>
              <p className="text-gray-500"><strong>Số lượng nhân viên:</strong> {user.numberOfEmployees}</p>
            </div>
          )}

          {user.role === "Candidate" && (
            <div>
              <h3 className="text-xl font-semibold">Thông tin ứng viên</h3>
              <p className="text-gray-500"><strong>Kỹ năng:</strong> {user.skills.join(", ") || "N/A"}</p>
              <p className="text-gray-500"><strong>Kinh nghiệm:</strong> {user.experience || "N/A"}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleEditAccount}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Edit className="inline-block mr-2" /> Chỉnh sửa
          </button>

          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <Trash className="inline-block mr-2" /> Xóa tài khoản
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
