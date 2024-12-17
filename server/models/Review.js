const mongoose = require("mongoose");

// Review Schema
const ReviewSchema = new mongoose.Schema({
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ID của người đánh giá
    required: true,
  },
  revieweeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ID của người được đánh giá
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Số sao nhỏ nhất
    max: 5, // Số sao lớn nhất
  },
  comment: {
    type: String,
    maxlength: 1000, // Nội dung nhận xét, tối đa 1000 ký tự
    default: "", // Không bắt buộc nhập
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"], // Trạng thái của đánh giá
    default: "pending", // Trạng thái mặc định
  },
  createdAt: {
    type: Date,
    default: Date.now, // Thời điểm đánh giá được tạo
  },
});

// Export model
const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
