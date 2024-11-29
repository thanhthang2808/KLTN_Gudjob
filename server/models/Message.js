const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Middleware xử lý content trước khi lưu
messageSchema.pre("save", function (next) {
  // Ẩn dãy số từ 9 chữ số trở lên thành dấu *
  this.content = this.content.replace(/\b\d{9,}\b/g, (match) => "*".repeat(match.length));

  // Ẩn các cụm từ chứa @, hiển thị dạng ****@****
  this.content = this.content.replace(/\S*@\S+/g, (match) => {
    const parts = match.split("@");
    const hiddenLeft = "*".repeat(parts[0].length); // Ẩn phần trước @
    const hiddenRight = "*".repeat(parts[1].length); // Ẩn phần sau @
    return `${hiddenLeft}@${hiddenRight}`;
  });

  next(); // Tiếp tục quy trình lưu
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
