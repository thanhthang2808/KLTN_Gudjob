import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

/**
 * Hàm để tạo và gán task cho ứng viên
 * @param {Object} taskData - Dữ liệu nhiệm vụ cần gán
 * @param {string} taskData.applicationId - ID của đơn ứng tuyển
 * @param {string} taskData.title - Tiêu đề của task
 * @param {string} taskData.description - Mô tả của task
 * @param {Date} taskData.deadline - Hạn chót của task
 * @param {number} taskData.paymentAmount - Số tiền thanh toán cho task
 * @returns {Promise<Object>} - Trả về dữ liệu task vừa được tạo
 */
const handleAssignTask = async (taskData, toast) => {
    try {
      const response = await axios.post(`${API_URL}/api/task/create-task`, taskData, {
        withCredentials: true,
      });
      toast({
        title: "Nhiệm vụ đã được tạo và gán thành công!",
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo và gán nhiệm vụ:", error.response?.data || error);
      toast({
        title: "Có lỗi xảy ra khi tạo và gán nhiệm vụ!",
        variant: "destructive",
      });
      throw error;
    }
  };
  

export default handleAssignTask;
