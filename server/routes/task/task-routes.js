const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { createTaskAndAssign, getMyTaskByRecruiter } = require("../../controllers/task/task-controller");

const router = express.Router();

router.post("/create-task", authMiddleware, createTaskAndAssign);
router.get("/get-tasks-by-recruiter", authMiddleware, getMyTaskByRecruiter);

module.exports = router;
