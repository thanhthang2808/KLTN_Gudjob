const express = require("express");
const { getUserInfo, updateAvatar } = require("../../controllers/user/user-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Hoặc sử dụng memory storage như đã hướng dẫn trước đó
const router = express.Router();

router.get("/user-info", authMiddleware, getUserInfo);
router.put("/update-avatar", authMiddleware, upload.single("avatar"), updateAvatar);

module.exports = router;
