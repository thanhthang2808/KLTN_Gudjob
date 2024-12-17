import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { TriangleAlert } from "lucide-react";

const CandidateSecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" hoặc "error"
  const { toast } = useToast();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

  // Đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.put(
        `${API_URL}/api/auth/change-password`,
        {
          password: currentPassword,
          newPassword: newPassword,
        },
        { withCredentials: true }
      );

      setMessage(response.data.message);
      setMessageType(response.data.success ? "success" : "error");
      toast({
        title: response.data.message,
      });

      window.location.href = "/"; // Chuyển hướng về trang chủ

      if (response.data.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Có lỗi xảy ra.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  // Xóa tài khoản
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await axios.delete(
        `${API_URL}/api/auth/delete-account`,
        {
          data: { password }, // Gửi password qua body
          withCredentials: true,
        }
      );

      setMessage(response.data.message);
      setMessageType(response.data.success ? "success" : "error");

      if (response.data.success) {
        toast({
          title: "Tài khoản đã được xóa thành công!",
        });
        window.location.href = "/"; // Chuyển hướng về trang chủ
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Có lỗi xảy ra.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center">
          Cài Đặt Bảo Mật
        </h1>
        {message && (
          <div
            className={`mb-4 p-2 text-sm rounded ${
              messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu mới
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-lg ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
          </button>
        </form>

        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={loading}
          className="mt-4 w-full py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
        >
          <div className="flex items-center justify-center">
            <TriangleAlert className="w-5 h-5 inline-block mr-2" />
            Xóa Tài Khoản
          </div>
        </button>
      </div>

      {/* Modal xác nhận xóa tài khoản */}
      {showConfirmModal && (
        <ConfirmModal
          title="Xóa tài khoản"
          content="Bạn có chắc chắn muốn xóa tài khoản của mình? Hành động này không thể hoàn tác."
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => {
            setShowConfirmModal(false);
            setShowPasswordModal(true);
          }}
        />
      )}

      {/* Modal nhập mật khẩu */}
      {showPasswordModal && (
        <ConfirmModal
          title="Nhập mật khẩu"
          content={
            <div>
              <span>Vui lòng nhập mật khẩu của bạn để xác nhận:</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          }
          onClose={() => setShowPasswordModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
};

export default CandidateSecuritySettings;
