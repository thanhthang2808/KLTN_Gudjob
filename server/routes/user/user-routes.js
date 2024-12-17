const express = require("express");
const { getUserInfo, updateAvatar, getSingleUser, updateCandidateInfo, getListUser, lockAccount, getListCandidate, uploadCV, getMyCV, deleteCV, getCompanies, updateRecruiterInfo, getListCompany, getTotalCandidate, getTotalCompany, deleteUserAccount } = require("../../controllers/user/user-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Hoặc sử dụng memory storage như đã hướng dẫn trước đó
const router = express.Router();

router.get("/user-info", authMiddleware, getUserInfo);
router.get("/get-mycv", authMiddleware, getMyCV);
router.put("/update-avatar", authMiddleware, updateAvatar);
router.put("/upload-cv", authMiddleware, uploadCV);  
router.delete("/delete-cv/:cvId", authMiddleware, deleteCV);
router.get("/get-list-candidates", authMiddleware, getListCandidate);
router.get("/get-list-companies", authMiddleware, getListCompany);
router.get("/get-companies", authMiddleware, getCompanies);
router.get("/get-list-users", authMiddleware, getListUser);
router.get("/total-candidate", authMiddleware, getTotalCandidate);
router.get("/total-company", authMiddleware, getTotalCompany);
router.put("/lock/:id", authMiddleware, lockAccount);
router.get("/:id", authMiddleware, getSingleUser);
router.put("/update-candidate-info", authMiddleware, updateCandidateInfo);
router.put("/update-company-info", authMiddleware, updateRecruiterInfo);
router.post("/update-wallet-balance", authMiddleware);
router.delete("/delete-user", authMiddleware, deleteUserAccount);


module.exports = router;
