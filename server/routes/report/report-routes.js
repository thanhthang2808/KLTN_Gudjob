const express = require('express');
const { authMiddleware } = require('../../controllers/auth/auth-controller');
const { reportUser, getAllReports, deleteReport } = require('../../controllers/report/report-controller');
const router = express.Router();

router.post("/report-user", authMiddleware, reportUser);
router.delete("/delete-report/:id", authMiddleware, deleteReport);
router.get("/get-all-reports", authMiddleware, getAllReports);

module.exports = router;