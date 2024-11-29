import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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


