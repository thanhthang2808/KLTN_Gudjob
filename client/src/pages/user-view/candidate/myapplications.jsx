import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import placeholderAvatar from "@/assets/default-user.png";
import { MessageCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState({});
  const [workType, setWorkType] = useState("Dài hạn");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/application/candidate/getall`,
          {
            withCredentials: true,
          }
        );
        setApplications(response.data.applications);
      } catch (error) {
        toast.error("Failed to fetch applications");
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      const jobPromises = applications.map(async (app) => {
        try {
          const jobResponse = await axios.get(
            `${API_URL}/api/job/${app.jobID}`,
            {
              withCredentials: true,
            }
          );

          const job = jobResponse.data.job;
          const recruiterInfo = job?.postedBy
            ? await axios
                .get(`${API_URL}/api/user/${job.postedBy}`, {
                  withCredentials: true,
                })
                .then((res) => res.data.user)
                .catch(() => null)
            : null;

          return {
            jobID: app.jobID,
            ...job,
            postedBy: recruiterInfo,
          };
        } catch {
          return null;
        }
      });

      const fetchedJobs = await Promise.all(jobPromises);
      const jobDetailsMap = {};
      fetchedJobs.forEach((job) => {
        if (job) jobDetailsMap[job.jobID] = job;
      });

      setJobDetails(jobDetailsMap);
    };

    if (applications.length > 0) {
      fetchJobDetails();
    }
  }, [applications]);

  const handleChat = (recruiterID) => {
    navigate(`/messages/${recruiterID}`);
  };

  // Cập nhật hàm xóa ứng tuyển
  const deleteApplication = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/api/application/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete application");
    }
  };

  const filteredApplications = applications.filter((app) => {
    const job = jobDetails[app.jobID] || {};
    const jobTitle = job.title ? job.title.toLowerCase() : "";
    const companyName = job.postedBy?.companyName
      ? job.postedBy.companyName.toLowerCase()
      : "";
    const searchLowercase = searchQuery.toLowerCase();

    const matchesSearch = jobTitle.includes(searchLowercase) || companyName.includes(searchLowercase);

    return (
      job.workType === workType && matchesSearch
    );
  });

  return (
    <div className="my-applications py-8 px-4 sm:px-8 lg:px-16">
      <h1 className="text-2xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
        My Applications
      </h1>

      {/* Container for search bar and dropdown */}
      <div className="mb-6 flex justify-center items-center space-x-4">
        {/* Thanh tìm kiếm */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs or companies"
          className="w-full sm:w-2/3 py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Dropdown lọc theo loại công việc */}
        <select
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
          className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Dài hạn">Dài hạn</option>
          <option value="Ngắn hạn">Ngắn hạn</option>
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <p className="text-center text-gray-600">No applications found.</p>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((app) => {
            const job = jobDetails[app.jobID] || {};
            const postedBy = job?.postedBy || {};

            return (
              <div
                key={app._id}
                className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4"
              >
                {/* Company Avatar */}
                <img
                  src={postedBy?.avatar?.url || placeholderAvatar}
                  alt="Company Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                />

                {/* Job Details */}
                <div className="flex-grow">
                  <h2 className="text-lg font-bold text-gray-800">
                    {job.title || "Job Title Not Available"}
                  </h2>
                  <p className="text-gray-600">
                    {postedBy.companyName || "Company Name Not Available"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Salary:{" "}
                    {job.fixedSalary
                      ? `${job.fixedSalary.toLocaleString()} VNĐ`
                      : job.salaryFrom && job.salaryTo
                      ? `${job.salaryFrom.toLocaleString()} - ${job.salaryTo.toLocaleString()} VNĐ`
                      : "Not Specified"}
                  </p>
                  <p className="text-gray-500 text-sm">
  Applied on: {new Date(app.createdAt).toLocaleString() || "Not Specified"}
</p>

                </div>

                {/* Chat Button */}
                <button
                  onClick={() => handleChat(postedBy._id)}
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => deleteApplication(app._id)}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  <span className="w-5 h-5 mr-2">🗑️</span> Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
