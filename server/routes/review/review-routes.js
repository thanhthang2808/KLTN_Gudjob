const express = require("express");
const { authMiddleware } = require("../../controllers/auth/auth-controller");
const { leaveAReviewForUser, getReviewsForUser, getAverageRatingForUser } = require("../../controllers/review/review-controller");

const router = express.Router();

router.post("/leave-a-review", authMiddleware, leaveAReviewForUser);
router.get("/get-reviews/:id", getReviewsForUser);
router.get("/get-average-rating/:id", getAverageRatingForUser);


module.exports = router;
