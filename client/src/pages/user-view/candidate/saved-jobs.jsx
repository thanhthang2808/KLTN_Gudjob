import React, { useEffect, useState } from "react";
import axios from "axios";
import anhmau from "@/assets/anhmau.png"; // Default avatar
import heart from "@/assets/heart.svg"; // Heart icon
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, HeartOff, Sparkles } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [companyNames, setCompanyNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const navigate = useNavigate();

  // Fetch saved jobs
  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/job/get-saved-jobs`, {
        withCredentials: true,
      });

      setSavedJobs(response.data.savedJobs);
      setTotalJobs(response.data.totalJobs);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    // If job is already saved, unsave it
    try {
      await axios.post(
        `${API_URL}/api/job/unsave-job`,
        { jobId },
        { withCredentials: true }
      );
      setSavedJobs(savedJobs.filter((job) => job !== jobId)); // Update savedJobs state
      window.location.reload();
    } catch (error) {
      console.error("Error unsaving job:", error);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  // Fetch avatar and company names for saved jobs
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userPromises = savedJobs.map((job) =>
        axios
          .get(`${API_URL}/api/user/${job.postedBy}`, { withCredentials: true })
          .then((userResponse) => {
            const avatarUrl = userResponse.data.user.avatar?.url;
            const companyName = userResponse.data.user.companyName;
            return {
              id: job._id,
              avatar: avatarUrl || anhmau,
              companyName: companyName || "Company Name",
            };
          })
          .catch((error) => {
            console.error("Error fetching user details:", error);
            return {
              id: job._id,
              avatar: anhmau,
              companyName: "Company Name",
            };
          })
      );

      const userData = await Promise.all(userPromises);
      const avatarMap = {};
      const companyMap = {};

      userData.forEach(({ id, avatar, companyName }) => {
        avatarMap[id] = avatar;
        companyMap[id] = companyName;
      });

      setAvatars(avatarMap);
      setCompanyNames(companyMap);
    };

    if (savedJobs.length > 0) {
      fetchUserDetails();
    }
  }, [savedJobs]);

  const formatSalary = (salary) => {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleUserClickNews = (id) => {
    navigate(`/candidate/job/${id}`);
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold text-gray-600 mb-4">
        Việc làm đã lưu ({totalJobs})
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 mx-auto">
        {savedJobs.length > 0 ? (
          savedJobs.map((job) => (
            <div
              key={job._id}
              className="relative bg-white rounded-lg cursor-pointer shadow-md p-4 min-w-3xl flex flex-col justify-between transition-all duration-200 ease-in-out hover:bg-green-100 active:bg-gray-200"
            >
              {job.isFeatured && (
                <div className="absolute top-1 left-1 bg-yellow-100 text-xs px-1 py-1 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                </div>
              )}
              <div className="flex">
                <img
                  src={avatars[job._id] || anhmau}
                  alt="Company Avatar"
                  className="w-16 h-16 rounded-full mr-4"
                  onClick={() => handleUserClickNews(job._id)}
                />
                <div className="flex-grow" onClick={() => handleUserClickNews(job._id)}>
                  <strong className="text-lg text-red-600 cursor-pointer hover:underline mb-1">
                    {job.title}
                  </strong>
                  <div className="text-gray-600 text-sm mb-1">
                    {companyNames[job._id] || "Company Name"}
                  </div>
                  <div className="flex space-x-3 text-gray-400 text-xs mt-2">
                    <div>{job.city}</div>
                    <div>
                      {job.jobPostedOn && Date.parse(job.jobPostedOn)
                        ? new Date(job.jobPostedOn).toLocaleDateString()
                        : "Ngày không xác định"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <h2 className="bg-blue-100 rounded-lg px-2 py-1 text-sm text-center">
                    {job.fixedSalary
                      ? `${formatSalary(job.fixedSalary)} VNĐ`
                      : `${formatSalary(job.salaryFrom)}-${formatSalary(
                          job.salaryTo
                        )} VNĐ`}
                  </h2>
                  <HeartOff
                    className="w-5 h-5 mt-6 text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={() => handleUnsaveJob(job._id)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex text-center justify-center w-screen text-gray-500">
            <div>Không có công việc nào đã lưu</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedJobs;
