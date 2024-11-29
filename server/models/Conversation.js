const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: String, // Nội dung tin nhắn cuối cùng
      default: "",
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
module.exports = Conversation;
