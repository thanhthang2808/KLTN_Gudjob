import React, { useEffect, useState } from "react";
import axios from "axios";
import anhmau from "@/assets/anhmau.png";
import heart from "@/assets/heart.svg";


import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function CandidateJobList() {
  const [jobs, setJobs] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [companyNames, setCompanyNames] = useState({});
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const getInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/user-info`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const formatSalary = (salary) => {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/job/getallrecommendjobs`, {
          withCredentials: true,
        });
        
        const sortedJobs = response.data.jobs.sort((a, b) => {
          return b.isFeatured - a.isFeatured;
        });
        setJobs(sortedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

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
              <Sparkles className=" w-3.5 h-3.5 text-yellow-400"/>
            
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
                    : `${formatSalary(job.salaryFrom)}-${formatSalary(job.salaryTo)} VNĐ`}
                </h2>
                <img
                  src={heart}
                  alt="Save Job"
                  className="w-6 h-6 mt-6 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No jobs available</p>
      )}
    </div>
  );
}

export default CandidateJobList;
