import axios from 'axios';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const handleChat = async (memberId, navigate) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/chat/create-conversation`,
        { memberId: memberId },
        { withCredentials: true }
      );
      const conversationId = data.conversation._id;
      navigate(`/conversation/${conversationId}`);
    } catch (error) {
      console.error("Không thể bắt đầu cuộc trò chuyện:", error);

    }
  };

export const getOtherPersonInfoInConversation = async (conversationId) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/chat/other-person`, {
        params: { conversationId },
        withCredentials: true,
      });
      return data;
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

