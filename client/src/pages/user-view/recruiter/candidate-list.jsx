import React from "react";

const CandidateList = ({ candidates = [], onViewDetails, onMessageCandidate }) => {
  if (!candidates.length) {
    return <p className="text-center text-gray-500">Không có ứng viên nào để hiển thị.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {candidates.map((candidate) => (
        <div key={candidate.id} className="p-4 border rounded-lg shadow-md">
          <img
            src={candidate.avatar?.url || "https://via.placeholder.com/150"}
            alt={`${candidate.name}'s avatar`}
            className="w-16 h-16 rounded-full mx-auto"
          />
          <h2 className="text-center text-lg font-bold mt-2">{candidate.name}</h2>
          <p className="text-center text-sm text-gray-500">{candidate.email}</p>
          <p className="text-center text-sm text-gray-500">{candidate.phone}</p>
          <div className="mt-4 flex justify-around">
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
  );
};

export default CandidateList;
