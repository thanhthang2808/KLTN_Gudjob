const express = require("express");
const { createConversation, sendMessage, getConversations, getMessages, getOtherPersonInConversation, markMessagesAsRead, getUnreadMessagesForUser } = require("../../controllers/chat-notification/chat-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const router = express.Router();


// Sử dụng authMiddleware cho tất cả các route chat
router.post("/create-conversation", authMiddleware, createConversation);
router.post("/messages", authMiddleware, sendMessage);
router.get("/my-conversations", authMiddleware, getConversations);
router.get("/messages/:conversationId", authMiddleware, getMessages);
router.put("/messages/read", authMiddleware, markMessagesAsRead);
router.get("/other-person", authMiddleware, getOtherPersonInConversation);
router.get("/unread-messages", authMiddleware, getUnreadMessagesForUser);


module.exports = router;
