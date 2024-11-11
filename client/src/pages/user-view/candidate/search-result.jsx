import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import anhmau from "@/assets/anhmau.png";
import heart from "@/assets/heart.svg";
import { Sparkles } from "lucide-react";
import CandidateSearch from "./search";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function SearchResults() {
  const location = useLocation();
  const {
    searchQuery,
    selectedCategories,
    location: locationQuery,
  } = location.state || {
    searchQuery: "",
    selectedCategories: [],
    location: "",
  };
  const [jobs, setJobs] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [companyNames, setCompanyNames] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/user-info`, {
        withCredentials: true,
      });
      // Set the user details if needed
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const formatSalary = (salary) => {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
            },
            withCredentials: true, // Ensure that cookies/authorization are sent
          }
        );
        // Sắp xếp công việc để các công việc Featured xuất hiện trên cùng
        const sortedJobs = response.data.jobs.sort((a, b) => {
          return b.isFeatured - a.isFeatured; // Sort jobs with featured ones first
        });
        setJobs(sortedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery, selectedCategories, locationQuery]);

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

  return (
    <div className="p-4 bg-gray-100">
  <CandidateSearch /> {/* Add the CandidateSearch component here */}
  <div className="text-lg font-semibold mt-4 lg:w-4/5 mx-auto">Kết quả tìm kiếm</div>

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
                  <div>{job.city}</div>
                  <div>
                    {job.jobPostedOn && Date.parse(job.jobPostedOn)
                      ? new Date(job.jobPostedOn).toLocaleDateString()
                      : "Ngày không xác định"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <h2 className="bg-blue-100 rounded-lg px-3 py-2 text-lg text-center">
                  {job.fixedSalary
                    ? `${formatSalary(job.fixedSalary)} VNĐ`
                    : `${formatSalary(job.salaryFrom)}-${formatSalary(job.salaryTo)} VNĐ`}
                </h2>
                <img
                  src={heart}
                  alt="Save Job"
                  className="w-8 h-8 mt-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Không tìm thấy công việc nào phù hợp với yêu cầu của bạn.</p>
      )}
    </div>
  )}
</div>

  );
}

export default SearchResults;
