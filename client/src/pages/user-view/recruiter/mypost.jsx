import InterviewModal from "@/components/ui/interview-modal";
import { handleChat } from "@/services/chat-service";
import axios from "axios";
import { Calendar, CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const MyPosts = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [applicationsCount, setApplicationsCount] = useState({});
  const [applicationsData, setApplicationsData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [modalJobId, setModalJobId] = useState(null);
  const [isOpenInterviewModal, setIsOpenInterviewModal] = useState(false);
  const [deletedJob, setDeletedJob] = useState(null);
  const [type, setType] = useState("");
  const navigate = useNavigate(); // Navigation hook

  // Fetching all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/job/getmyjobs`, {
          withCredentials: true,
        });
        setMyJobs(data.myJobs);
        // Fetch the number of applications for each job
        data.myJobs.forEach(async (job) => {
          const response = await axios.get(
            `${API_URL}/api/application/get-applications-for-job/${job._id}`,
            { withCredentials: true }
          );
          setApplicationsCount((prev) => ({
            ...prev,
            [job._id]: response.data.applications.length, // Save the count
          }));
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applications for a specific job
  const fetchApplications = async (jobId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/application/get-applications-for-job/${jobId}`,
        { withCredentials: true }
      );
      const res = await axios.get(
        `${API_URL}/api/job/${jobId}`,
        { withCredentials: true }
      );
      setApplicationsData(response.data.applications);
      setType(res.data.job.workType);
      setModalJobId(jobId); // Set job ID for the modal
      setShowModal(true); // Open the modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  // Handle delete job
  const handleDeleteJob = async (jobId) => {
    try {
      const jobToDelete = myJobs.find((job) => job._id === jobId);
      await axios.delete(`${API_URL}/api/job/delete/${jobId}`, {
        withCredentials: true,
      });
      setDeletedJob(jobToDelete); // Save deleted job
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      setShowModal(true); // Show modal

      // Auto-close modal after 1 second
      setTimeout(() => {
        setShowModal(false);
        setDeletedJob(null);
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const acceptApplication = async (id) => {
    try {
      await axios.post(
        `${API_URL}/api/application/accept/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("Application accepted successfully!");
      refreshApplications(); // Refresh the applications list
      setShowModal(false); // Close the modal
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to accept application"
      );
    }
  };

  // New function to reject an application
  const rejectApplication = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/application/reject/${id}`, {
        withCredentials: true,
      });
      toast.success("Application rejected successfully!");
      refreshApplications(); // Refresh the applications list
      setShowModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reject application"
      );
    }
  };

  const refreshApplications = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/application/employer/getall`,
        { withCredentials: true }
      );
      setApplications(res.data.applications);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to refresh applications"
      );
    }
  };

  const openInterviewModal = (application) => {
    setSelectedApplication(application); // Set selected application
    setIsOpenInterviewModal(true); // Open the modal
  };

  

  return (
    <div className="myJobs page bg-gray-100 min-h-screen p-5">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Danh sách công việc đã đăng</h1>
        {/* New Post Button */}
        <div className="mb-4">
          <Link to="/recruiter/postjob">
            <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center">
              Thêm bài đăng mới
              <CirclePlus size={20} className="inline-block ml-2" />
            </button>
          </Link>
        </div>

        {/* Modal for Applications */}
        {showModal && modalJobId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto">
              {/* Header (fixed position) */}
              <div className="sticky top-0 bg-white z-10 flex justify-between items-center mb-4 p-4">
                <h2 className="text-2xl font-semibold">
                  Danh sách đơn ứng tuyển
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Đóng
                </button>
              </div>

              {/* Application List */}
              {applicationsData.length > 0 ? (
                <div className="space-y-6">
                  {applicationsData.map((application) => (
                    <div
                      key={application._id}
                      className="bg-gray-100 p-4 rounded-lg shadow-sm flex justify-between items-start"
                    >
                      <div className="flex flex-col space-y-2 w-4/5">
                        <div className="font-semibold text-lg hover:text-blue-500 hover:underline cursor-pointer" onClick={() => navigate(`/recruiter/candidate/${application.applicantID.user}`)}>
                          {application.name}
                        </div>
                        {/* <div className="text-sm">
                          Email: {application.email}
                        </div>
                        <div className="text-sm">
                          Phone: {application.phone}
                        </div> */}
                        <div className="text-sm">
                          Địa chỉ: {application.address}
                        </div>
                        <div className="text-sm">
                          Cover letter: 
                        </div>
                        <div className="text-sm bg-gray-200 p-2 rounded-md">
                         {application.coverLetter}
                        </div>
                        <div className="text-sm">
                          Trạng thái: {application.status}
                        </div>
                        <a
                          href={`https://docs.google.com/gview?url=${application.resume.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Xem CV
                        </a>
                        {/* Application Status and Action Buttons */}
                        {application.status === "Processing" ? (
                          <div className="flex space-x-3 mt-3">
                            <button
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                              onClick={() => acceptApplication(application._id)} // Accept application
                            >
                              Accept
                            </button>
                            <button
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                              onClick={() => rejectApplication(application._id)} // Reject application
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <p
                            className={`text-lg font-semibold ${
                              application.status === "Accepted"
                                ? "text-green-600"
                                : application.status === "Rejected"
                                ? "text-red-600"
                                : "text-gray-700"
                            } mt-3`}
                          >
                            {application.status}
                          </p>
                        )}
                      </div>

                      {/* Message Button */}
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() =>
                            handleChat(application.applicantID.user, navigate)
                          } // Nhắn tin cho ứng viên
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-2"
                        >
                          Nhắn tin
                        </button>
                        {application.status === "Accepted" && type === "Tự do" && (<button
                          onClick={() =>
                            navigate(`/recruiter/assign-task/${application._id}`)
                          } // Nhắn tin cho ứng viên
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Giao việc
                        </button>)}
                        {application.status === "Accepted" && type !== "Tự do" && (<button
                        onClick={() => openInterviewModal(application)}
                         
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          <Calendar size={20} className="inline-block mr-2" />
                          Phỏng vấn
                        </button>)}
                        {isOpenInterviewModal && (
                          <InterviewModal
                            onClose={() => setIsOpenInterviewModal(false)}
                            application={selectedApplication}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Chưa có đơn ứng tuyển nào.</p>
              )}
            </div>
          </div>
        )}
        {/* Job List */}
        {myJobs.length > 0 ? (
          <div className="space-y-6">
            {myJobs.map((job) => (
              <div className="bg-white shadow-lg rounded-lg p-5" key={job._id}>
                <div className="flex justify-between">
                  <div>
                    <p className="text-lg font-semibold">{job.title}</p>
                    <p className="text-sm text-gray-500">
                      Địa điểm: {job.city}, {job.country}
                    </p>
                    <p className="text-sm text-gray-500">
                      Lương:{" "}
                      {job.fixedSalary
                        ? `${job.fixedSalary.toLocaleString()} VNĐ`
                        : `${job.salaryFrom?.toLocaleString()} VNĐ - ${job.salaryTo?.toLocaleString()} VNĐ`}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        job.status === "Pending"
                          ? "text-yellow-500"
                          : job.status === "Approved"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      Trạng thái: {job.status}
                    </p>
                    {/* Display the number of applications and link to open the modal */}
                    {applicationsCount[job._id] !== undefined && (
                      <p className="text-sm text-gray-600 hover:text-blue-600 hover:underline cursor-pointer" onClick={() => fetchApplications(job._id)}>
                        Số đơn ứng tuyển: {applicationsCount[job._id]}
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      onClick={() => navigate(`/recruiter/job/${job._id}`)}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2"
                    >
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Xóa
                    </button>
                    {job.workType === "Tự do" ? (
              <div className=" bottom-1 right-1 text-md px-1 py-1 rounded-lg mt-10 ml-10">
                <div className="text-green-400 font-bold">Việc làm Freelance</div>
              </div>
            ) : (<div className=" bottom-1 right-1 text-md px-1 py-1 rounded-lg mt-10 ml-10">
              <div className="text-white font-bold">Việc làm Freelance</div>
            </div>)}

                  </div>
                </div>
                
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">Bạn chưa có bài đăng nào.</p>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
