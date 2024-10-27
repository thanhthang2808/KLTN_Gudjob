import React, { useEffect, useState } from "react";
import axios from "axios";
import anhmau from "@/assets/anhmau.png";
import heart from "@/assets/heart.svg";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL; // Replace this with your environment variable

function CandidateJobList() {
  const [jobs, setJobs] = useState([]);
  const [avatars, setAvatars] = useState({});
  const [companyNames, setCompanyNames] = useState({});
  const navigate = useNavigate();

  // Format number to add dots every 3 digits
  const formatSalary = (salary) => {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Fetch all jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/job/getall`, {
          withCredentials: true, // Include credentials if needed
        });
        setJobs(response.data.jobs); // Assuming the response structure has jobs inside data
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Fetch avatars and company names for each job's poster
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userPromises = jobs.map((job) =>
        axios
          .get(`${API_URL}/api/user/${job.postedBy}`, { withCredentials: true })
          .then((userResponse) => {
            const avatarUrl = userResponse.data.user.avatar?.url;
            const companyName = userResponse.data.user.companyName; // Assuming companyName is in the user response
            return {
              id: job._id,
              avatar: avatarUrl || anhmau,
              companyName: companyName || "Company Name", // Fallback if undefined
            };
          })
          .catch((error) => {
            console.error("Error fetching user details:", error);
            return {
              id: job._id,
              avatar: anhmau, // Fallback to default image on error
              companyName: "Company Name", // Fallback if error occurs
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

  // Handle click event to navigate to user news page
  const handleUserClickNews = (id) => {
    navigate(`/candidate/job/${id}`); // Navigate to job details page based on job ID
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 mx-auto">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div
            key={job._id} // Ensure job._id is unique
            className="bg-white rounded-lg cursor-pointer shadow-md p-4 min-w-3xl flex flex-col justify-between transition-all duration-200 ease-in-out hover:bg-green-100 active:bg-gray-200" // Changed hover to apply to the whole card
            onClick={() => handleUserClickNews(job._id)}
          >
            <div className="flex">
              <img
                src={avatars[job._id] || anhmau} // Display avatar or fallback to default
                alt="Company Avatar"
                className="w-16 h-16 rounded-full mr-4"
              />
              <div className="flex-grow">
                <strong className="text-lg text-red-600 cursor-pointer hover:underline mb-1">
                  {job.title}
                </strong>
                <div className="text-gray-600 text-sm mb-1">
                  {companyNames[job._id] || "Company Name"} {/* Display company name */}
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
                <h2 className="bg-yellow-200 rounded-lg px-2 py-1 text-sm text-center">
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
