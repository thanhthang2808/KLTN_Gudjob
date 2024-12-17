import { X, Star } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import handleLeaveAReview from "@/services/review-services";

const RatingModal = ({ onClose, revieweeId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarHover = (value) => {
    setHoverRating(value);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      alert("Vui lòng chọn số sao và nhập nhận xét.");
      return;
    }

    try {
        await handleLeaveAReview(revieweeId, rating, comment);
        alert("Review thành công!")
        window.location.reload();
    } catch (error) {
        alert("Có lỗi xảy ra khi đánh giá!")
        console.log(error);
      }

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 rounded-t-lg bg-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Đánh giá</h3>
          <X
            className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 hover:bg-gray-300"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 cursor-pointer ${
                  (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
              />
            ))}
          </div>
          <textarea
            className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Nhập nhận xét của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 px-4 py-3 border-t border-gray-300">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export { RatingModal };
