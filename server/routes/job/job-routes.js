const express = require('express');
const { postJob,  getMyJobs, deleteJob, getSingleJob, getNumberOfJobs, getAllJobs, getSearchResults, getAllRecommendJobs, getPendingJobs, updateJobStatus, addToSavedJobs, removeFromSavedJobs, getSavedJobs, getJobsPostedByUser } = require('../../controllers/job/job-controller');
const { authMiddleware } = require('../../controllers/auth/auth-controller');
const router = express.Router();

router.post("/post", authMiddleware, postJob);
router.get("/getall", authMiddleware, getAllJobs);
router.get("/getallrecommendjobs", authMiddleware, getAllRecommendJobs);
router.get("/get-search-results", authMiddleware, getSearchResults);
router.get("/getmyjobs", authMiddleware, getMyJobs);
router.get("/get-saved-jobs", authMiddleware, getSavedJobs);
router.get("/getnumberofjobs", authMiddleware, getNumberOfJobs);
router.get("/getpendingjobs", authMiddleware, getPendingJobs);
router.get("/jobs-postedby/:id", authMiddleware, getJobsPostedByUser);
router.delete("/delete/:id", authMiddleware, deleteJob);
router.put("/:id/status", updateJobStatus);
router.get("/:id", authMiddleware, getSingleJob);
router.post("/save-job", authMiddleware, addToSavedJobs);
router.post("/unsave-job", authMiddleware, removeFromSavedJobs);



module.exports = router;
