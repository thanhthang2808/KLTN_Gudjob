const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message");

// Tạo cuộc trò chuyện
const createConversation = async (req, res) => {
  const { id } = req.user;
  const { memberId } = req.body;

  if (!memberId) {
    return res
      .status(400)
      .json({ message: "memberId is required" });
  }

  try {
    // Kiểm tra nếu cuộc trò chuyện đã tồn tại
    let conversation = await Conversation.findOne({
      members: { $all: [id, memberId] }, // Kiểm tra sự tồn tại của cả hai thành viên
    });

    if (!conversation) {
      // Tạo cuộc trò chuyện mới nếu chưa tồn tại
      conversation = new Conversation({ members: [id, memberId] });
      await conversation.save();
    } else {
        return res.status(200).json({
            success: true,
            message: "Cuộc trò chuyện đã tồn tại!",
            conversation,
            });
    }

    res.status(200).json({
      success: true,
      message: "Tạo cuộc trò chuyện thành công!",
      conversation,
    });
  } catch (error) {
    console.error("Lỗi khi tạo cuộc trò chuyện:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo cuộc trò chuyện",
      error,
    });
  }
};
// Gửi tin nhắn
const sendMessage = async (req, res) => {
  const { conversationId, content } = req.body;
  const senderId = req.user.id;

  try {
    // Tạo tin nhắn mới
    const message = new Message({
      conversationId,
      sender: senderId,
      content,
    });

    await message.save();

    // Cập nhật lastMessage trong conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      updatedAt: Date.now(),
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi gửi tin nhắn", error });
  }
};

// Lấy danh sách cuộc trò chuyện
const getConversations = async (req, res) => {
  const { id } = req.user;

  try {
    const conversations = await Conversation.find({ members: id })
      .sort({ updatedAt: -1 }) // Sắp xếp theo thời gian mới nhất
      .populate("members", "name avatar email role"); // Lấy thông tin cơ bản của thành viên

    res.status(200).json(conversations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách cuộc trò chuyện", error });
  }
};

// Lấy danh sách tin nhắn
const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách tin nhắn", error });
  }
};

// Đánh dấu tin nhắn đã đọc
const markMessageAsRead = async (req, res) => {
  const { messageId, userId } = req.body;

  try {
    const message = await Message.findById(messageId);

    if (!message.readBy.includes(userId)) {
      message.readBy.push(userId); // Thêm user vào danh sách readBy
      await message.save();
    }

    res.status(200).json({ message: "Tin nhắn đã được đánh dấu là đã đọc." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi đánh dấu tin nhắn đã đọc", error });
  }
};

module.exports = {
  createConversation,
  sendMessage,
  getConversations,
  getMessages,
  markMessageAsRead,
};
