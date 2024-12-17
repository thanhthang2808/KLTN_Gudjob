const mongoose = require("mongoose");
const Message = require("../../models/Message");
const Conversation = require("../../models/Conversation");

const deleteOrphanMessages = async (req, res) => {
  try {
    // Bước 1: Lấy tất cả các conversationId có trong bảng Message
    const conversationIds = await Message.distinct("conversationId");

    // Bước 2: Kiểm tra các conversationId tồn tại trong bảng Conversation
    const validConversations = await Conversation.find({
      _id: { $in: conversationIds }
    }).select("_id");

    // Lấy danh sách các conversationId hợp lệ
    const validConversationIds = validConversations.map((conv) => conv._id.toString());

    // In danh sách các conversationId hợp lệ để kiểm tra
    console.log("Valid conversationIds (in Conversation):", validConversationIds);

    // Bước 3: Tìm các tin nhắn có conversationId không hợp lệ
    const orphanMessages = await Message.find({
      conversationId: { $nin: validConversationIds }
    });

    // In ra các tin nhắn không hợp lệ
    console.log("Orphan messages found:", orphanMessages);

    if (orphanMessages.length === 0) {
      return res.status(200).json({ success: true, message: "No orphan messages found." });
    }

    // Bước 4: Xóa các tin nhắn không hợp lệ
    const deletedMessages = await Message.deleteMany({
      conversationId: { $nin: validConversationIds }
    });

    console.log("Deleted orphan messages count:", deletedMessages.deletedCount);

    if (deletedMessages.deletedCount > 0) {
      console.log(`${deletedMessages.deletedCount} orphan messages deleted.`);
    } else {
      console.log("No orphan messages were deleted.");
    }

    return res.status(200).json({
      success: true,
      message: `${deletedMessages.deletedCount} orphan messages deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting orphan messages:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = { deleteOrphanMessages };
