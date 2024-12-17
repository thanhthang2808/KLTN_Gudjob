import React, { useState } from "react";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker"; // Dùng thư viện react-datepicker cho chọn ngày
import "react-datepicker/dist/react-datepicker.css"; // Thêm CSS của react-datepicker
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const InterviewModal = ({ onClose, application }) => {
  const [interviewTime, setInterviewTime] = useState(null);
  const [interviewAddress, setInterviewAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScheduleInterview = async () => {
    if (!interviewTime || !interviewAddress) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.put(
        `${API_URL}/api/application/schedule-interview`,
        {
          applicationId: application._id,
          interviewTime: interviewTime.toISOString(),
          interviewConfirmed: "Pending", // Trạng thái xác nhận ban đầu là Pending
          interviewAddress,
        },
        { withCredentials: true }
      );
      console.log(data);
      alert("Lên lịch phỏng vấn thành công!");
      onClose(); // Gọi onClose để đóng modal sau khi thành công
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lên lịch!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={'fixed inset-0 z-50 '}>
      <div className="bg-black bg-opacity-50 flex items-center justify-center w-full h-full">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold mb-4">Lên lịch phỏng vấn</h2>

          {/* Thời gian phỏng vấn */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Chọn thời gian phỏng vấn:</label>
            <DatePicker
              selected={interviewTime}
              onChange={(date) => setInterviewTime(date)}
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="Pp"
              className="w-full p-2 border rounded-md"
            />
          </div>

          {/* Địa chỉ phỏng vấn */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Địa chỉ phỏng vấn:</label>
            <input
              type="text"
              value={interviewAddress}
              onChange={(e) => setInterviewAddress(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Nhập địa chỉ phỏng vấn"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              onClick={onClose} // Gọi onClose để đóng modal
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={handleScheduleInterview}
              disabled={isSubmitting}
              className={`px-4 py-2 ${
                isSubmitting ? "bg-gray-500" : "bg-blue-500"
              } text-white rounded-md hover:bg-blue-600`}
            >
              {isSubmitting ? "Đang xử lý..." : "Lên lịch"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewModal;
