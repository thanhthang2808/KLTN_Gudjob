import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Lock, Trash, Unlock } from "lucide-react"; // Importing icons for lock and trash
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/get-list-users`, {
          withCredentials: true,
        });
        setUsers(response.data.users);
        console.log("Users:", response.data.users);
      } catch (err) {
        setError("Could not fetch users.");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleLockAccount = async (id, currentStatus) => {
    try {
      // Determine the new status
      const newStatus = currentStatus === "locked" ? "active" : "locked"; // Toggle between locked and active

      // Call the backend API to lock or unlock the account
      await axios.put(
        `${API_URL}/api/user/lock/${id}`,
        { status: newStatus }, // Pass the new status in the body
        { withCredentials: true }
      );

      // Update the state to reflect the new status
      setUsers(
        users.map((user) =>
          user._id === id ? { ...user, status: newStatus } : user
        )
      );
    } catch (err) {
      console.error("Error updating account status:", err);
    }
  };

  const handleDeleteAccount = async (userId) => {
    try {
      await axios.delete(`${API_URL}/api/user/${userId}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/user-detail/${id}`);
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Danh sách người dùng
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">Tên người dùng</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Trạng thái</th>
              <th className="px-6 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.status === "locked" ? (
                      <span className="text-red-500">Locked</span>
                    ) : (
                      <span className="text-green-500">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleViewDetails(user._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Xem chi tiết
                    </button>
                    {user.status === "locked" ? (
                      <button
                        onClick={() => handleLockAccount(user._id, user.status)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <Unlock className="inline-block mr-2" /> Mở khóa
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLockAccount(user._id)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        <Lock className="inline-block mr-2" /> Khóa
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAccount(user._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash className="inline-block mr-2" /> Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
