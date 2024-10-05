const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { postApplication, recruiterGetAllApplications, candidateGetAllApplications, candidateDeleteApplication } = require("../../controllers/job/application-controller");

const router = express.Router();

router.post("/post", authMiddleware, postApplication);
router.get("/employer/getall", authMiddleware, recruiterGetAllApplications);
router.get("/candidate/getall", authMiddleware, candidateGetAllApplications);
router.delete("/delete/:id", authMiddleware, candidateDeleteApplication);

module.exports = router;    