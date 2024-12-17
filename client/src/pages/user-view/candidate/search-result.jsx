import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import anhmau from "@/assets/placeholder-logo.png";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import CandidateSearch from "./search";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function SearchResults() {
  const location = useLocation();
  const {
    searchQuery,
    selectedCategories,
    location: locationQuery,
    workType: workTypeQuery,
  } = location.state || {
    searchQuery: "",
    selectedCategories: [],
    location: "",
    workType: "",
  };

  const [jobs, setJobs] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [companyNames, setCompanyNames] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);
  const jobsPerPage = 10; // Số lượng công việc mỗi trang
  const navigate = useNavigate();

  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/user-info`, {
          withCredentials: true,
        });
        const { user } = response.data;
        setSavedJobs(user.savedJobs);
        // Set the user details if needed
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getInfo();
  }, []);
        

  const formatSalary = (salary) => {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/job/get-search-results`,
          {
            params: {
              searchQuery,
              selectedCategories: selectedCategories.join(","),
              location: locationQuery,
              workType: workTypeQuery,
              page: currentPage,
              limit: jobsPerPage,
            },
            withCredentials: true,
          }
        );
        const sortedJobs = response.data.jobs.sort((a, b) => {
          return b.isFeatured - a.isFeatured; // Sort jobs with featured ones first
        });
        setJobs(sortedJobs);
        setTotalPages(Math.ceil(response.data.totalJobs / jobsPerPage)); // Tính tổng số trang
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [
    searchQuery,
    selectedCategories,
    locationQuery,
    workTypeQuery,
    currentPage,
  ]);

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

  const handleJobClick = (id) => {
    navigate(`/candidate/job/${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 bg-gray-100">
      <CandidateSearch /> {/* Add the CandidateSearch component here */}
      <div className="text-lg font-semibold mt-4 lg:w-4/5 mx-auto">
        Kết quả tìm kiếm
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 p-2 mx-auto lg:w-4/5">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job._id}
                className="relative bg-white rounded-lg cursor-pointer shadow-md p-3 flex flex-col justify-between transition-all duration-200 ease-in-out hover:bg-green-100 active:bg-gray-200"
                onClick={() => handleJobClick(job._id)}
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
                    className="w-32 h-32 rounded-lg mr-6"
                  />
                  <div className="flex-grow">
                    <strong className="text-xl text-red-600 cursor-pointer hover:underline mb-2">
                      {job.title}
                    </strong>
                    <div className="text-gray-600 text-sm mb-2">
                      {companyNames[job._id] || "Company Name"}
                    </div>
                    <div className="flex space-x-4 text-gray-400 text-xs mt-2">
                      {job.city && <div>{job.city}</div>}
                      <div>
                        {job.expired ? (
                          <span className="text-red-400">
                            {job.applicationDeadline &&
                            Date.parse(job.applicationDeadline)
                              ? new Date(
                                  job.applicationDeadline
                                ).toLocaleDateString()
                              : "Ngày không xác định"}
                          </span>
                        ) : (
                          <span>
                            {job.applicationDeadline &&
                            Date.parse(job.applicationDeadline)
                              ? new Date(
                                  job.applicationDeadline
                                ).toLocaleDateString()
                              : "Ngày không xác định"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 text-gray-500 text-xs mt-5">
                      {job.requiredSkills.map((skill) => (
                        <div key={skill}>
                          <div className="px-2 py-1 bg-gray-200 rounded-full">
                            {skill}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <h2 className="bg-blue-100 rounded-lg px-3 py-2 text-lg text-center">
                      {job.fixedSalary
                        ? `${formatSalary(job.fixedSalary)} VNĐ`
                        : `${formatSalary(job.salaryFrom)}-${formatSalary(
                            job.salaryTo
                          )} VNĐ`}
                    </h2>
                    
                      {savedJobs.includes(job._id) ? (
                        <div className="text-red-600 mt-8" onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện click lan sang cha
                          handleSaveJob(job._id);
                        }}>
                          <HeartFilled className="text-2xl"/>
                        </div>
                      ) : (
                        <div className="text-gray-500 mt-8" onClick={(e) => {
                          e.stopPropagation(); // Ngăn chặn sự kiện click lan sang cha
                          handleSaveJob(job._id);
                        }}>
                          <HeartOutlined className="text-2xl"/>
                        </div>
                      )}
                   
                  </div>
                  {job.workType === "Tự do" && (
                    <div className="absolute bottom-1 right-1 bg-green-400 text-xs px-1 py-1 rounded-lg">
                      <text className="text-white">Việc làm Freelance</text>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy công việc nào phù hợp với yêu cầu của bạn.</p>
          )}
        </div>
      )}
      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          className={`px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 ${
            currentPage === 1 ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className={`px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 ${
            currentPage === totalPages ? "disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default SearchResults;
