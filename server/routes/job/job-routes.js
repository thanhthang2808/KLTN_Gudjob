const express = require('express');
const { postJob, getAllJobs, getMyJobs, deleteJob, getSingleJob } = require('../../controllers/job/job-controller');
const { authMiddleware } = require('../../controllers/auth/auth-controller');
const router = express.Router();

router.post("/post", authMiddleware, postJob);
router.get("/getall", authMiddleware, getAllJobs);
router.get("/getmyjobs", authMiddleware, getMyJobs);
router.delete("/delete/:id", authMiddleware, deleteJob);
router.get("/:id", authMiddleware, getSingleJob);


module.exports = router;
// import express from "express";
// import {
//   deleteJob,
//   getAllJobs,
//   getMyJobs,
//   getSingleJob,
//   postJob,
//   updateJob,
// } from "../controllers/job/job-controller.js";
// import { isAuthenticated } from "../controllers/auth/auth-controller.js";

// const router = express.Router();

// router.get("/getall", getAllJobs);
// router.post("/post", isAuthenticated, postJob);
// router.get("/getmyjobs", isAuthenticated, getMyJobs);
// router.put("/update/:id", isAuthenticated, updateJob);
// router.delete("/delete/:id", isAuthenticated, deleteJob);
// router.get("/:id", isAuthenticated, getSingleJob);

// export default router;