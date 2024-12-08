const express = require('express');
const { postJob,  getMyJobs, deleteJob, getSingleJob, getNumberOfJobs, getAllJobs, getSearchResults, getAllRecommendJobs, getPendingJobs, updateJobStatus } = require('../../controllers/job/job-controller');
const { authMiddleware } = require('../../controllers/auth/auth-controller');
const router = express.Router();

router.post("/post", authMiddleware, postJob);
router.get("/getall", authMiddleware, getAllJobs);
router.get("/getallrecommendjobs", authMiddleware, getAllRecommendJobs);
router.get("/get-search-results", authMiddleware, getSearchResults);
router.get("/getmyjobs", authMiddleware, getMyJobs);
router.get("/getnumberofjobs", authMiddleware, getNumberOfJobs);
router.get("/getpendingjobs", authMiddleware, getPendingJobs);
router.delete("/delete/:id", authMiddleware, deleteJob);
router.put("/:id/status", updateJobStatus);
router.get("/:id", authMiddleware, getSingleJob);

module.exports = router;
