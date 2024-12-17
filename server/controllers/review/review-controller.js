const Review = require("../../models/Review");

const leaveAReviewForUser = async (req, res) => {
    const { revieweeId, rating, comment } = req.body;
    const { user } = req;
    
    if (!revieweeId || !rating || !comment) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }
    
    try {
        const review = new Review({
        revieweeId,
        rating,
        comment,
        reviewerId: user.id,
        });
        console.log(review);
    
        await review.save();
    
        res.status(200).json({
        success: true,
        message: "Leaved a review successfully",
        });
    } catch (error) {
        console.error("Error in leaveAReviewForUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getReviewsForUser = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    
    try {
        const reviews = await Review.find({ revieweeId: id }).populate("reviewerId", "name");
        const totalReviews = await Review.countDocuments({ revieweeId: id });
    
        res.status(200).json({
        success: true,
        reviews,
        totalReviews,
        });
    } catch (error) {
        console.error("Error in getReviewsForUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAverageRatingForUser = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    
    try {
        const reviews = await Review.find({ revieweeId: id });
    
        if (reviews.length === 0) {
        return res.status(200).json({
            success: true,
            averageRating: 0,
        });
        }
    
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
    
        res.status(200).json({
        success: true,
        averageRating,
        });
    } catch (error) {
        console.error("Error in getAverageRatingForUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    leaveAReviewForUser,
    getReviewsForUser,
    getAverageRatingForUser,
};