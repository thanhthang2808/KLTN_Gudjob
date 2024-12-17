import React, { useEffect, useState } from "react";
import axios from "axios";
import anhmau from "@/assets/placeholder-logo.png";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function CandidateJobList() {
  const [jobs, setJobs] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [companyNames, setCompanyNames] = useState({});
  const [user, setUser] = useState({});
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 9; // Số lượng công việc trên mỗi trang
  const navigate = useNavigate();

  const getInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/user-info`, {
        withCredentials: true,
      });
      setUser(response.data.user);
      setSavedJobs(response.data.user.savedJobs);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const formatSalary = (salary) => {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Fetch công việc theo trang
  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/job/getallrecommendjobs`, {
        withCredentials: true,
        params: {
          page: currentPage,
          limit: jobsPerPage,
        },
      });

      const sortedJobs = response.data.jobs.sort((a, b) => b.isFeatured - a.isFeatured);
      setJobs(sortedJobs);
      setTotalPages(Math.ceil(response.data.totalJobs / jobsPerPage)); // Tính tổng số trang
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        // Nếu công việc đã lưu, bỏ lưu
        await axios.post(
          `${API_URL}/api/job/unsave-job`,
          { jobId },
          { withCredentials: true }
        );
        setSavedJobs((prevSavedJobs) =>
          prevSavedJobs.filter((job) => job !== jobId) // Cập nhật lại danh sách savedJobs
        );
      } else {
        // Nếu công việc chưa lưu, lưu lại
        await axios.post(
          `${API_URL}/api/job/save-job`,
          { jobId },
          { withCredentials: true }
        );
        setSavedJobs((prevSavedJobs) => [...prevSavedJobs, jobId]); // Cập nhật lại danh sách savedJobs
      }
    } catch (error) {
      console.error("Error saving or unsaving job:", error);
    }
  };  

  useEffect(() => {
    fetchJobs();
  }, [currentPage]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userPromises = jobs.map((job) =>
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

    if (jobs.length > 0) {
      fetchUserDetails();
    }
  }, [jobs]);

  const handleUserClickNews = (id) => {
    navigate(`/candidate/job/${id}`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2 mx-auto">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div
              key={job._id}
              className="relative bg-white rounded-lg cursor-pointer shadow-md p-4 min-w-3xl flex flex-col justify-between transition-all duration-200 ease-in-out hover:bg-green-100 active:bg-gray-200"
              onClick={() => handleUserClickNews(job._id)}
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
                />
                <div className="flex-grow">
                  <strong className="text-lg text-red-600 cursor-pointer hover:underline mb-1">
                    {job.title}
                  </strong>
                  <div className="text-gray-600 text-sm mb-1">
                    {companyNames[job._id] || "Company Name"}
                  </div>
                  <div className="flex text-gray-400 text-xs mt-2">
                    {job.city && <div className="mr-4">{job.city}</div>}
                    <div>
                      {job.applicationDeadline && Date.parse(job.applicationDeadline)
                        ? new Date(job.applicationDeadline).toLocaleDateString()
                        : "Ngày không xác định"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <h2 className="bg-blue-100 rounded-lg px-2 py-1 text-sm text-center">
                    {job.fixedSalary
                      ? `${formatSalary(job.fixedSalary)} VNĐ`
                      : `${formatSalary(job.salaryFrom)}-${formatSalary(job.salaryTo)} VNĐ`}
                  </h2>
                  {savedJobs.includes(job._id) ? (
                        <div className="text-red-600 mt-10" onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện click lan sang cha
                          handleSaveJob(job._id);
                        }}>
                          <HeartFilled className="text-xl"/>
                        </div>
                      ) : (
                        <div className="text-gray-500 mt-10" onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện click lan sang cha
                          handleSaveJob(job._id);
                        }}>
                          <HeartOutlined className="text-xl"/>
                        </div>
                      )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex text-center justify-center w-screen text-gray-500">
            <div>Không có công việc nào phù hợp với bạn</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className={`px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className={`px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default CandidateJobList;
