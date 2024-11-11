const express = require('express');
const { postJob,  getMyJobs, deleteJob, getSingleJob, getNumberOfJobs, getAllJobs, getSearchResults, getAllRecommendJobs } = require('../../controllers/job/job-controller');
const { authMiddleware } = require('../../controllers/auth/auth-controller');
const router = express.Router();

router.post("/post", authMiddleware, postJob);
router.get("/getall", authMiddleware, getAllJobs);
router.get("/getallrecommendjobs", authMiddleware, getAllRecommendJobs);
router.get("/get-search-results", authMiddleware, getSearchResults);
router.get("/getmyjobs", authMiddleware, getMyJobs);
router.get("/getnumberofjobs", authMiddleware, getNumberOfJobs);
router.delete("/delete/:id", authMiddleware, deleteJob);
router.get("/:id", authMiddleware, getSingleJob);

module.exports = router;
