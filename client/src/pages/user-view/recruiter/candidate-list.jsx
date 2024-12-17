import React from "react";

const CandidateList = ({ candidates = [], onViewDetails, onMessageCandidate, pagination, onPageChange }) => {
  if (!candidates.length) {
    return <p className="text-center text-gray-500">Không có ứng viên nào để hiển thị.</p>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map((candidate, index) => (
          <div
            key={candidate._id || index}
            className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col items-center">
              <img
                src={candidate.avatar?.url || "https://via.placeholder.com/150"}
                alt={`${candidate.name}'s avatar`}
                className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover"
              />
              <h2 className="text-center text-xl font-bold mt-4 text-gray-800">
                {candidate.name}
              </h2>
              <p className="text-center text-sm text-gray-500 mt-1">{candidate.email}</p>
              <p className="text-center text-sm text-gray-500 mt-1">{candidate.phone}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700">Kỹ năng:</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {candidate.skills && candidate.skills.length > 0 ? (
                  candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Chưa cập nhật kỹ năng</span>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => onViewDetails(candidate)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Chi tiết
              </button>
              <button
                onClick={() => onMessageCandidate(candidate._id)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Nhắn tin
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          className={`px-4 py-2 border rounded ${pagination.currentPage === 1 ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={pagination.currentPage === 1}
          onClick={() => onPageChange(pagination.currentPage - 1)}
        >
          Trang trước
        </button>
        <span className="text-gray-700">
          Trang {pagination.currentPage} / {pagination.totalPages}
        </span>
        <button
          className={`px-4 py-2 border rounded ${pagination.currentPage === pagination.totalPages ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={pagination.currentPage === pagination.totalPages}
          onClick={() => onPageChange(pagination.currentPage + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default CandidateList;