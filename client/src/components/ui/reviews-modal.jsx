import React, { useEffect, useState } from "react";
import axios from "axios";
import { X } from "lucide-react"; // Icon for closing the modal

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const ReviewsModal = ({ revieweeId, onClose }) => {
  const [averageRating, setAverageRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRatingAndReviews = async () => {
      try {
        // Fetch average rating of the recruiter
        const ratingResponse = await axios.get(`${API_URL}/api/review/get-average-rating/${revieweeId}`, 
            { withCredentials: true }
        );
        setAverageRating(ratingResponse.data.averageRating);

        // Fetch reviews of the recruiter
        const reviewsResponse = await axios.get(`${API_URL}/api/review/get-reviews/${revieweeId}`,
            { withCredentials: true }
        );
        setReviews(reviewsResponse.data.reviews);
      } catch (error) {
        console.error("Error fetching rating and reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (revieweeId) {
      fetchRatingAndReviews();
    }
  }, [revieweeId]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, index) => (
          <svg key={index} className="w-4 h-4 text-yellow-400" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 15l-5.5 3 2-6.5-5-4h6.5L10 0l2 6.5H18l-5 4 2 6.5L10 15z"></path>
          </svg>
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <svg key={index} className="w-4 h-4 text-gray-300" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 15l-5.5 3 2-6.5-5-4h6.5L10 0l2 6.5H18l-5 4 2 6.5L10 15z"></path>
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg p-6 w-full max-w-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{reviews.length} đánh giá</h2>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex items-center">
                {averageRating ? renderStars(averageRating) : <div>Chưa có đánh giá</div>}
                <span className="ml-2 text-gray-600">
                  {averageRating ? `${averageRating} / 5` : ""}
                </span>
              </div>
            </div>

            {/* Reviews List */}
            <div className="max-h-80 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Bài đánh giá</h3>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="border-b py-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{review.reviewerId?.name || "Anonymous"}</p>
                        <div className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Chưa có bài đánh giá nào.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewsModal;
