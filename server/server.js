const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth/auth-routes");
const userRoutes = require("./routes/user/user-routes");
const jobRoutes = require("./routes/job/job-routes");
const applicationRoutes = require("./routes/job/application-routes");
const walletRoutes = require("./routes/user/wallet-routes");
const chatRoutes = require("./routes/chat-notification/chat-routes");
const taskRoutes = require("./routes/task/task-routes");
const { paymentHandler } = require("./controllers/payment/payment");
const Message = require("./models/Message");
const Conversation = require("./models/Conversation");

dotenv.config();

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log(error));

// Khởi tạo Express và HTTP Server
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Tích hợp Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(cookieParser());
app.use(express.json());

// Định tuyến
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/task", taskRoutes);
app.post("/payment", paymentHandler);

// Quản lý kết nối Socket.IO
let onlineUsers = new Map(); // Lưu người dùng online

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Nhận thông tin người dùng khi kết nối
  socket.on("addUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online with socket ID: ${socket.id}`);
  });

  // Xử lý gửi tin nhắn
  // Socket.IO Server code
  socket.on("sendMessage", async (message) => {
    const { conversationId, content, sender } = message;
  
    const newMessage = new Message({
      conversationId,
      content,
      sender,
      
    });
  
    try {
      await newMessage.save(); // Lưu tin nhắn vào DB
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: content,
        updatedAt: Date.now(),
      });
      onlineUsers.forEach((socketId, userId) => {
        if (userId !== sender) {
          io.to(socketId).emit(`message_${conversationId}`, newMessage); // Gửi tin nhắn tới người nhận
        }
      });
  
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });
  

  // Xử lý ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Xóa người dùng khỏi danh sách onlineUsers khi họ ngắt kết nối
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} removed from onlineUsers`);
      }
    });
  });
});

// Start server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
