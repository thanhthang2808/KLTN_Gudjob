import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
      setModalVisible(true); // Hiển thị modal khi thành công
    } catch (error) {
      setMessage("Something went wrong!");
      console.error("Error resetting password:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate("/auth/login"); // Chuyển hướng về trang đăng nhập
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Dọn dẹp bộ đếm
    }
  }, [isModalVisible, navigate]);

  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-gradient-to-r from-blue-500 via-green-500 to-green-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Khôi phục mật khẩu
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          Hãy thiết lập mật khẩu mới cho tài khoản của bạn.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500'}`}
          >
            {loading ? "Resetting..." : "Đặt lại mật khẩu"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center text-sm ${
              message.includes("do not match") || message.includes("wrong") ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Modal thông báo */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Mật khẩu đã được đặt lại thành công!
            </h3>
            <p className="text-center text-gray-600 mb-4">
              Đang chuyển hướng về trang đăng nhập <span className="font-bold">{countdown}s...</span> 
            </p>
            <button
              onClick={() => navigate("/auth/login")}
              className="w-full py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
            >
              Về trang đăng nhập
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
