const Conversation = require("../../models/Conversation");
const Message = require("../../models/Message");
const User = require("../../models/User");
const mongoose = require("mongoose");

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
      .populate("members", "name companyName avatar email role"); // Lấy thông tin cơ bản của thành viên

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

// Lấy số tin nhắn chưa đọc


// Đánh dấu tin nhắn đã đọc
const markMessagesAsRead = async (req, res) => {
  const { conversationId } = req.body;
  const userId = req.user.id;

  try {
    const messages = await Message.updateMany(
      { conversationId, readBy: { $ne: userId } }, // Lọc các tin nhắn chưa đọc bởi userId
      { $push: { readBy: userId } } // Thêm userId vào danh sách readBy
    );

    res.status(200).json({ message: "Đã đánh dấu tất cả tin nhắn là đã đọc.", updatedCount: messages.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi đánh dấu tin nhắn.", error });
  }
};

const getOtherPersonInConversation = async (req, res) => {
  const { conversationId } = req.query;
  const { id } = req.user;

  try {
    // Tìm cuộc trò chuyện theo ID
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
    }

    // Kiểm tra xem người dùng hiện tại có nằm trong danh sách members hay không
    if (!conversation.members.includes(id)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập vào cuộc trò chuyện này" });
    }

    // Lấy ID của người dùng khác trong cuộc trò chuyện
    const otherPersonId = conversation.members.find((member) => member.toString() !== id);

    if (!otherPersonId) {
      return res.status(404).json({ message: "Không tìm thấy người dùng khác trong cuộc trò chuyện" });
    }

    // Lấy thông tin người dùng khác
    const otherPersonInfo = await User.findById(otherPersonId).select("name email avatar companyName");

    if (!otherPersonInfo) {
      return res.status(404).json({ message: "Không tìm thấy thông tin của người dùng khác" });
    }

    res.status(200).json({ message: "success", otherPersonInfo });
  } catch (error) {
    console.error("Error in getOtherPersonInConversation:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin người khác trong cuộc trò chuyện", error });
  }
};

const getUnreadMessagesForUser = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id); // Sử dụng `new` để tạo ObjectId

  try {
    // Tìm tất cả các cuộc trò chuyện mà user tham gia
    const userConversations = await Conversation.find({ members: userId });

    if (!userConversations || userConversations.length === 0) {
      return res.status(200).json({ totalUnread: 0, conversationUnread: {} });
    }

    const conversationIds = userConversations.map((conv) => conv._id);

    // Đếm tin nhắn chưa đọc cho từng cuộc trò chuyện
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          conversationId: { $in: conversationIds },  // Tin nhắn trong các cuộc trò chuyện đã chọn
          readBy: { $ne: userId },                    // Tin nhắn chưa đọc bởi userId
          sender: { $ne: userId },                    // Tin nhắn không phải do người dùng gửi
        },
      },
      {
        $group: {
          _id: "$conversationId",     // Nhóm theo conversationId
          count: { $sum: 1 },          // Đếm số tin nhắn chưa đọc
        },
      },
    ]);
    

    // Tính tổng số tin nhắn chưa đọc
    const totalUnread = unreadCounts.reduce((sum, item) => sum + item.count, 0);

    // Chuyển đổi kết quả thành dạng map: { conversationId: count }
    const conversationUnread = unreadCounts.reduce((map, item) => {
      map[item._id] = item.count;
      return map;
    }, {});

    res.status(200).json({ totalUnread, conversationUnread });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy số lượng tin nhắn chưa đọc.", error });
  }
};

module.exports = {
  createConversation,
  sendMessage,
  getConversations,
  getMessages,
  markMessagesAsRead,
  getOtherPersonInConversation,
  getUnreadMessagesForUser
};
