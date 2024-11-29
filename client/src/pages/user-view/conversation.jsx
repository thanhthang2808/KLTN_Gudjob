import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "@/store/auth-slice";
import chatImage from "@/assets/chat-image.png";
import io from "socket.io-client"; // Import Socket.io Client
import { PlusCircle } from "lucide-react";

const ConversationPage = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [conversation, setConversation] = useState([]);
  const [conversations, setConversations] = useState([]); // Danh sách các cuộc trò chuyện

  // Lấy thông tin người dùng từ Redux store
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const dispatch = useDispatch();

  // Reference để cuộn đến cuối cùng của tin nhắn
  const messagesEndRef = useRef(null);

  // Kết nối đến Socket.io Server
  const socket = useRef(null);

  // Kiểm tra trạng thái đăng nhập và gọi checkAuth nếu người dùng chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      dispatch(checkAuth()); // Kiểm tra trạng thái xác thực
    }
  }, [isAuthenticated, isLoading, dispatch]);

  useEffect(() => {
    // Lấy danh sách các cuộc trò chuyện khi component mount
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/chat/my-conversations`,
          {
            withCredentials: true,
          }
        );
        setConversations(data);
      } catch (error) {
        console.error("Lỗi khi tải cuộc trò chuyện:", error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    // Lấy danh sách tin nhắn khi conversationId thay đổi
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/chat/messages/${conversationId}`,
          { withCredentials: true }
        );
        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          setMessages([]); // Gán giá trị mặc định nếu không phải mảng
        }
      } catch (error) {
        console.error("Lỗi khi tải tin nhắn:", error);
      }
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  useEffect(() => {
    // Thiết lập kết nối đến Socket.io khi component được render
    socket.current = io(API_URL, { withCredentials: true });

    // Khi kết nối thành công, thông báo với server về người dùng
    if (user?.id) {
      socket.current.emit("addUser", user.id); // Thông báo server về người dùng
    }

    // Lắng nghe tin nhắn mới từ server
    socket.current.on(`message_${conversationId}`, (newMessage) => {
      console.log("Received new message:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.current.disconnect(); // Ngắt kết nối khi component unmount
    };
  }, [conversationId, user?.id]);

  useEffect(() => {
    // Cuộn xuống dưới cùng khi có tin nhắn mới
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  const sendMessage = async () => {
    try {
      if (!newMessage.trim()) return; // Đảm bảo không gửi tin nhắn rỗng

      const message = {
        conversationId,
        content: newMessage,
        sender: user?.id, // ID người gửi tin nhắn
      };

      // Gửi tin nhắn qua socket đến server
      socket.current.emit("sendMessage", message);

      // Cập nhật tin nhắn ngay lập tức ở phía client
      setMessages((prev) => [...prev, { ...message, createdAt: new Date() }]);

      setNewMessage(""); // Xóa nội dung tin nhắn sau khi gửi
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Hiển thị loading khi đang kiểm tra trạng thái đăng nhập
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>; // Hiển thị thông báo nếu người dùng chưa đăng nhập
  }

  return (
    <div className="flex h-screen w-screen">
      {/* Bên trái - Danh sách cuộc trò chuyện */}
      <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Cuộc trò chuyện</h1>
          <Link to={`/${user.role.toLowerCase()}/home`} className="text-blue-400 hover:text-white">
      Về trang chủ
    </Link>
        </div>
        <ul className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Tìm kiếm cuộc trò chuyện"
              className="w-full p-2 rounded-lg bg-gray-700 text-white"
            />
            <PlusCircle
              size={25}
              className="text-blue-400 hover:text-white cursor-pointer ml-3"
            />
          </div>
          {conversations.map((conversation) => (
            <li
              key={conversation._id}
              className="mb-2 hover:bg-gray-700 rounded-lg p-2"
            >
              <Link
                to={`/conversation/${conversation._id}`}
                className="text-blue-400 hover:text-white"
              >
                {conversation._id || "Cuộc trò chuyện mới"}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bên phải - Cửa sổ nhắn tin */}
      <div className="flex-1 max-h-screen bg-white p-6 flex flex-col">
        {/* Hiển thị màn hình chào mừng nếu chưa chọn cuộc trò chuyện */}
        {!conversationId ? (
          <div className="flex flex-col items-center justify-center h-full">
            <img src={chatImage} alt="Chat" className="w-32 h-32 mb-4" />
            <h2 className="text-3xl font-semibold text-gray-700 mb-2">
              Chào mừng đến với cuộc trò chuyện
            </h2>
            <p className="text-gray-500">
              Vui lòng chọn một cuộc trò chuyện từ danh sách bên trái để bắt
              đầu.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Conversation_{conversationId}
            </h2>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-md">
              <div className="messages-container space-y-4">
                {Array.isArray(messages) && messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isNewDay =
                      index === 0 ||
                      new Date(msg.createdAt).toDateString() !==
                        new Date(messages[index - 1]?.createdAt).toDateString(); // Kiểm tra ngày mới

                    return (
                      <React.Fragment key={msg?._id || index}>
                        {isNewDay && (
                          <div className="text-center text-gray-500 text-sm my-2">
                            {new Date(msg.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        )}
                        <div
                          className={`message-item flex ${
                            msg.sender === user?.id
                              ? "justify-end"
                              : "justify-start"
                          } mb-4`}
                        >
                          <div
                            className={`message-box p-4 rounded-lg shadow-md max-w-xs ${
                              msg.sender === user?.id
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-black"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p
                              className={`text-xs mt-2 ${
                                msg.sender === user?.id
                                  ? "text-gray-200"
                                  : "text-gray-400"
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                ) : (
                  <p className="text-center text-gray-500">
                    Không có tin nhắn nào.
                  </p>
                )}
                <div ref={messagesEndRef} /> {/* Cuộn đến cuối cùng */}
              </div>
            </div>

            {/* Input và gửi tin nhắn */}
            <div className="mt-4 p-4 bg-white shadow-md flex items-center rounded-lg">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-lg p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tin nhắn..."
              />
              <button
                onClick={sendMessage}
                className="ml-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600"
              >
                Gửi
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationPage;
