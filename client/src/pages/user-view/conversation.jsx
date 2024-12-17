import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { checkAuth } from "@/store/auth-slice";
import chatImage from "@/assets/chat-image.png";
import io from "socket.io-client";
import { Ellipsis, PlusCircle } from "lucide-react";
import { getOtherPersonInfoInConversation } from "@/services/chat-service";

const ConversationPage = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherPersonsInfo, setOtherPersonsInfo] = useState({});
  const [unreadMessages, setUnreadMessages] = useState({});
  const [conversations, setConversations] = useState([]);

  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );

  const API_URL = import.meta.env.VITE_REACT_APP_API_URL;
  const dispatch = useDispatch();

  const messagesEndRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      dispatch(checkAuth());
    }
  }, [isAuthenticated, isLoading, dispatch]);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/chat/unread-messages`,
          { withCredentials: true }
        );
        setUnreadMessages(data.conversationUnread);
      } catch (error) {
        console.error("Lỗi khi lấy số tin nhắn chưa đọc:", error);
      }
    };

    fetchUnreadMessages();
  }, [conversations]);

  useEffect(() => {
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
    const fetchOtherPersonsInfo = async () => {
      const infoMap = {};
      for (const conversation of conversations) {
        const data = await getOtherPersonInfoInConversation(conversation._id);
        infoMap[conversation._id] = data.otherPersonInfo;
      }
      setOtherPersonsInfo(infoMap);
    };

    fetchOtherPersonsInfo();
  }, [conversations]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/chat/messages/${conversationId}`,
          { withCredentials: true }
        );
        if (Array.isArray(data)) {
          setMessages(data);
          await markAllAsRead(conversationId);
        } else {
          setMessages([]);
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
    socket.current = io(API_URL, { withCredentials: true });

    if (user?.id) {
      socket.current.emit("addUser", user.id);
    }

    socket.current.on(`message_${conversationId}`, (newMessage) => {
      console.log("Received new message:", newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [conversationId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  const markAllAsRead = async (conversationId) => {
    try {
      await axios.put(
        `${API_URL}/api/chat/messages/read`,
        { conversationId, userId: user?.id },
        { withCredentials: true }
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.readBy.includes(user?.id)
            ? msg
            : { ...msg, readBy: [...msg.readBy, user?.id] }
        )
      );
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả tin nhắn là đã đọc:", error);
    }
  };

  const sendMessage = async () => {
    try {
      if (!newMessage.trim()) return;

      const message = {
        conversationId,
        content: newMessage,
        sender: user?.id,
      };

      socket.current.emit("sendMessage", message);

      setMessages((prev) => [...prev, { ...message, createdAt: new Date() }]);

      setNewMessage("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="flex h-screen w-screen">
      <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Cuộc trò chuyện</h1>
          <Link
            to={`/${user.role.toLowerCase()}/home`}
            className="text-blue-400 hover:text-white"
          >
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
              className={`p-2 rounded-lg cursor-pointer hover:bg-gray-700 ${
                conversationId === conversation._id ? "bg-gray-700" : ""
              }`}
            >
              <Link
                to={`/conversation/${conversation._id}`}
                onClick={() =>
                  setUnreadMessages((prev) => ({
                    ...prev,
                    [conversation._id]: 0,
                  }))
                }
              >
                <div
                  className={`flex items-center justify-between ${
                    conversationId === conversation._id ? "text-white" : ""
                  }`}
                >
                  <div className="flex items-center flex-grow">
                    <img
                      src={otherPersonsInfo[conversation._id]?.avatar?.url}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <h3 className="font-semibold">
                        {otherPersonsInfo[conversation._id]?.companyName ||
                          otherPersonsInfo[conversation._id]?.name ||
                          "Username"}
                      </h3>
                      {/* <p
                        className={`text-sm ${
                          unreadMessages[conversation._id] > 0
                            ? "text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {conversation.lastMessage}
                      </p> */}
                    </div>
                  </div>
                  {unreadMessages[conversation._id] > 0 && (
                    <div className="flex items-center justify-end flex-shrink-0">
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {unreadMessages[conversation._id]}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 max-h-screen bg-white p-6 flex flex-col">
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
            <div className="flex items-center mb-4">
              <img
                src={otherPersonsInfo[conversationId]?.avatar?.url}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-5">
                <h3 className="font-bold text-2xl">
                  {otherPersonsInfo[conversationId]?.companyName ||
                    otherPersonsInfo[conversationId]?.name}
                </h3>
                <p className="text-gray-500">
                  {otherPersonsInfo[conversationId]?.companyName
                    ? "Nhà tuyển dụng"
                    : "Ứng viên"}{" "}
                </p>
              </div>
              <Ellipsis size={25} className="ml-auto cursor-pointer" />
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100 rounded-lg shadow-md">
              <div className="messages-container space-y-4">
                {Array.isArray(messages) && messages.length > 0 ? (
                  messages.map((msg, index) => {
                    const isNewDay =
                      index === 0 ||
                      new Date(msg.createdAt).toDateString() !==
                        new Date(messages[index - 1]?.createdAt).toDateString();

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
                <div ref={messagesEndRef} />
              </div>
            </div>

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
