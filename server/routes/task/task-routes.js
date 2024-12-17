const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { createTaskAndAssign, getMyTaskByRecruiter, getMyTaskByCandidate, acceptTaskByCandidate, getASingeTask, denyTaskByCandidate, submitTaskByCandidate, approveTaskByRecruiter, rejectTaskByRecruiter, getAllTaskByAdmin } = require("../../controllers/task/task-controller");

const router = express.Router();

router.post("/create-task", authMiddleware, createTaskAndAssign);
router.get("/get-tasks-by-recruiter", authMiddleware, getMyTaskByRecruiter);
router.get("/get-tasks-by-candidate", authMiddleware, getMyTaskByCandidate);
router.get("/get-all-tasks", authMiddleware, getAllTaskByAdmin);
router.post("/accept-task", authMiddleware, acceptTaskByCandidate);
router.post("/deny-task", authMiddleware, denyTaskByCandidate);
router.post("/submit-task", authMiddleware, submitTaskByCandidate);
router.get("/single-task/:id", authMiddleware, getASingeTask);
router.post("/approve-task", authMiddleware, approveTaskByRecruiter);
router.post("/reject-task", authMiddleware, rejectTaskByRecruiter);

module.exports = router;
