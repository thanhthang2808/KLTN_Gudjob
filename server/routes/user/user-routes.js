const express = require("express");
const { getUserInfo, updateAvatar, getSingleUser, updateCandidateInfo } = require("../../controllers/user/user-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Hoặc sử dụng memory storage như đã hướng dẫn trước đó
const router = express.Router();

router.get("/user-info", authMiddleware, getUserInfo);
router.put("/update-avatar", authMiddleware, updateAvatar);
router.get("/:id", authMiddleware, getSingleUser);
router.put("/update-candidate-info", authMiddleware, updateCandidateInfo);
router.post("/update-wallet-balance", authMiddleware);

module.exports = router;
