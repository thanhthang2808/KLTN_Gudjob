import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateList from "./candidate-list";
import { handleChat } from "@/services/chat-service";
import BannerSlider from "@/components/user-view/candidate/banner-slider";
import welcomeBg from "@/assets/bg.jpg";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function RecruiterHome() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const navigate = useNavigate();

  // Fetch candidates from API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/get-list-candidates`, {
          params: { page: pagination.currentPage, limit: 10 },
          withCredentials: true,
        });

        if (response.data && response.data.users) {
          setCandidates(response.data.users);
          setFilteredCandidates(response.data.users);
          setPagination((prev) => ({
            ...prev,
            totalPages: response.data.pagination.totalPages,
          }));
        } else {
          setCandidates([]);
          setFilteredCandidates([]);
          setPagination((prev) => ({
            ...prev,
            totalPages: 1,
          }));
        }
      } catch (error) {
        console.error("Lỗi khi gọi API danh sách ứng viên:", error);
        setCandidates([]);
        setFilteredCandidates([]);
        setPagination((prev) => ({
          ...prev,
          totalPages: 1,
        }));
      }
    };

    fetchCandidates();
  }, [pagination.currentPage]);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/job/getmyjobs`, {
          withCredentials: true,
        });

        if (response.data && response.data.myJobs) {
          setJobs(response.data.myJobs);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API danh sách job:", error);
        setJobs([]);
      }
    };

    fetchJobs();
  }, []);

  // Filter candidates based on search term and selected job
  useEffect(() => {
    let filtered = candidates;

    // Search by name or email
    if (searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by job's required skills
    if (selectedJob) {
      const job = jobs.find((job) => job._id === selectedJob);
      if (job && job.requiredSkills) {
        filtered = filtered.filter((candidate) =>
          job.requiredSkills.every((skill) =>
            candidate.skills.some((candidateSkill) =>
              candidateSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }
    }

    setFilteredCandidates(filtered);
  }, [searchTerm, selectedJob, candidates, jobs]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleJobChange = (e) => {
    setSelectedJob(e.target.value);
  };

  const handleViewDetails = (candidate) => {
    navigate(`/recruiter/candidate/${candidate._id}`);
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <div
        className="flex flex-col bg-blue-200 w-full p-4 bg-cover items-center bg-center"
        style={{ backgroundImage: `url(${welcomeBg})` }}
      >
        <h1 className="text-2xl text-blue-400 font-bold max-w-[80%]">
          Gudjob - Giải pháp tuyển dụng hiệu quả, kết nối nhân tài nhanh chóng.
        </h1>
        <h1 className="text-sm my-2 text-white max-w-[80%]">
          Nền tảng uy tín giúp bạn tìm kiếm, sàng lọc và kết nối với những ứng viên xuất sắc.
        </h1>
        <BannerSlider />
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-10">
        <input
          type="text"
          placeholder="Tìm kiếm ứng viên theo tên hoặc email..."
          className="p-2 border rounded-lg w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />

        <select
          name="job"
          className="p-2 border rounded-lg w-full"
          value={selectedJob}
          onChange={handleJobChange}
        >
          <option value="">Tìm ứng viên phù hợp theo việc đã đăng</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>
      </div>

      {/* Candidate List */}
      <CandidateList
        candidates={filteredCandidates || []}
        onViewDetails={handleViewDetails}
        onMessageCandidate={(id) => handleChat(id, navigate)}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default RecruiterHome;