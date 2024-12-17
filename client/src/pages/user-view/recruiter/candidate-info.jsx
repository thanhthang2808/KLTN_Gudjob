import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Flag, Mail, Phone } from "lucide-react";
import { Rating } from "@mui/material";
import ReviewsModal from "@/components/ui/reviews-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const CandidateInfo = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const navigate = useNavigate();

  // Fetch candidate details
  const fetchCandidateDetails = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/${candidateId}`, {
        withCredentials: true,
      });
      setCandidate(data.user);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
    }
  };

  const handleReportAccount = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/report/report-user`,
        {
          reportedId: candidateId,
          content: reportContent,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("Báo cáo tài khoản thành công!");
        setShowReportModal(false);
      }
    } catch (error) {
      console.error("Lỗi khi báo cáo tài khoản:", error);
      alert("Có lỗi xảy ra khi báo cáo tài khoản.");
    }
  };

  // Fetch average rating
  const fetchAverageRating = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/review/get-average-rating/${candidateId}`);
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error("Error fetching average rating:", error);
    }
  };

  const onClose = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchCandidateDetails();
      await fetchAverageRating();
      setLoading(false);
    };
    fetchData();
  }, [candidateId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-medium text-red-500">Candidate not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Candidate Info */}
        <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
          <img
            src={candidate.avatar?.url || "/default-avatar.png"}
            alt={candidate.name}
            className="w-32 h-32 rounded-full border-2 border-gray-300"
          />
          <div className="text-center lg:text-left">
            <h1 className="text-2xl font-bold text-gray-800">{candidate.name}</h1>
            <p className="text-gray-600 text-sm mt-2">
              {candidate.description || "No description available"}
            </p>
            <div className="flex gap-4 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-400" />
                {candidate.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-400" />
                {candidate.phone || "Phone not provided"}
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-2 text-yellow-500">
                <span className="text-lg font-semibold">{averageRating}</span>
                <Rating
                  name="read-only"
                  value={averageRating}
                  readOnly
                  precision={0.5}
                  size="large"
                  sx={{
                    color: "#ffd700",
                  }}
                />
                <span
                  className="text-gray-500 cursor-pointer hover:underline hover:text-blue-500"
                  onClick={() => setOpenModal(true)}
                >
                  Xem đánh giá
                </span>
                <Flag
                  className="w-5 h-5 text-gray-300 ml-2 cursor-pointer"
                  onClick={() => setShowReportModal(true)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Modal */}
        {openModal && <ReviewsModal revieweeId={candidateId} onClose={onClose} />}
        {showReportModal && (
          <ConfirmModal
            title="Báo cáo tài khoản"
            content={
              <div>
                <span>Nhập nội dung báo cáo vi phạm:</span>
                <input
                  type="reportContent"
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                  className="mt-2 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>
            }
            onClose={() => setShowReportModal(false)}
            onConfirm={handleReportAccount}
          />
        )}

        {/* Skills */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          {candidate.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills provided</p>
          )}
        </div>

        {/* Experience */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Experience</h2>
          {candidate.experience.length > 0 ? (
            <ul className="list-disc pl-5 text-gray-700">
              {candidate.experience.map((exp, index) => (
                <li key={index}>{exp}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No experience provided</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateInfo;
