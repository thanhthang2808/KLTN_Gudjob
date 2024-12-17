import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CandidateSearch from "./search";
import money from "@/assets/money.svg";
import location from "@/assets/location.svg";
import experience from "@/assets/experience.svg";
import time from "@/assets/time.svg";
import share from "@/assets/share.svg";
import anhmau from "@/assets/anhmau.png";
import heartgreen from "@/assets/heartgreen.svg";
import bell from "@/assets/bell.svg";
import level from "@/assets/level.svg";
import numberpeople from "@/assets/numberpeople.svg";
import job from "@/assets/job.svg";
import gender from "@/assets/gender.svg";
import { CalendarX2, Check } from "lucide-react";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function JobDetails() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posterInfo, setPosterInfo] = useState(null);
  const [error, setError] = useState(false);
  const [applied, setApplied] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const navigateTo = useNavigate();

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

  useEffect(() => {
    axios
      .get(`${API_URL}/api/application/candidate/check-job-applied/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success === true) {
          setApplied(true);
        }
      })
      .catch((error) => {
        console.error("Error checking if job is applied:", error);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/job/${id}`, { withCredentials: true })
      .then((res) => {
        setJob(res.data.job);
        setLoading(false);

        if (res.data.job.postedBy) {
          axios
            .get(`${API_URL}/api/user/${res.data.job.postedBy}`, {
              withCredentials: true,
            })
            .then((res) => {
              setPosterInfo(res.data.user);
            })
            .catch((error) => {
              console.error("Error fetching poster info:", error);
            });
          axios
            .get(`${API_URL}/api/review/get-reviews/${res.data.job.postedBy}`, {
              withCredentials: true,
            })
            .then((res) => {
              setReviews(res.data.reviews);
              console.log(res.data.reviews);
            })
            .catch((error) => {
              console.error("Error fetching reviews:", error);
            });
        }
        
      })
      .catch(() => {
        setError(true);
        setLoading(false);
        navigateTo("/not-found");
      });
  }, [id, navigateTo]);

  const handleSaveJob = async (jobId) => {
    if (savedJobs.includes(jobId)) {
      // If job is already saved, unsave it
      try {
        await axios.post(
          `${API_URL}/api/job/unsave-job`,
          { jobId },
          { withCredentials: true }
        );
        setSavedJobs(savedJobs.filter((job) => job !== jobId)); // Update savedJobs state
      } catch (error) {
        console.error("Error unsaving job:", error);
      }
    } else {
      // If job is not saved, save it
      try {
        await axios.post(
          `${API_URL}/api/job/save-job`,
          { jobId },
          { withCredentials: true }
        );
        setSavedJobs([...savedJobs, jobId]); // Update savedJobs state
      } catch (error) {
        console.error("Error saving job:", error);
      }
    }
  };

  const calculateMatchPercentage = (requiredSkills = [], userSkills = []) => {
    // Ensure both requiredSkills and userSkills are arrays
    if (!Array.isArray(requiredSkills) || !Array.isArray(userSkills)) return 0;

    if (requiredSkills.length === 0) return 0; // If there are no required skills, return 0%

    // Find how many required skills the user has
    const matchedSkills = requiredSkills.filter((skill) =>
      userSkills.includes(skill)
    );

    // Calculate match percentage
    const matchPercentage =
      (matchedSkills.length / requiredSkills.length) * 100;

    return matchPercentage.toFixed(0); // Return percentage as a formatted string
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-yellow-400">Đang tải...</p>
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-600">
          Không thể tải chi tiết công việc. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      {/* Header */}
      <CandidateSearch />
      <div className="flex flex-row h-full w-full justify-center">
        <div className="flex flex-col flex-6.5 p-5">
          <div className="bg-white p-5 rounded min-w-full shadow-md">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <h2 className="text-sm text-gray-500 mb-6">{job.category}</h2>
            <div className="flex justify-between mb-6 space-x-20">
              {" "}
              {/* Thêm space-x-4 ở đây */}
              <div className="flex items-center">
                <img src={money} alt="Mức lương" className="w-12 h-12 mr-2" />
                <div>
                  <h2 className="text-sm">Mức lương</h2>
                  {job.fixedSalary ? (
                    <strong className="text-lg">
                      {job.fixedSalary.toLocaleString()} VNĐ
                    </strong>
                  ) : (
                    <strong className="text-lg">
                      {job.salaryFrom.toLocaleString()} VNĐ -{" "}
                      {job.salaryTo.toLocaleString()} VNĐ
                    </strong>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <img src={location} alt="Địa điểm" className="w-12 h-12 mr-2" />
                <div>
                  <h2 className="text-sm">Địa điểm</h2>
                  <strong className="text-lg">{job.city}</strong>
                </div>
              </div>
              <div className="flex items-center">
                <img
                  src={experience}
                  alt="Kinh nghiệm"
                  className="w-12 h-12 mr-2"
                />
                <div>
                  <h2 className="text-sm">Kinh nghiệm</h2>
                  <strong className="text-lg">{job.experience}</strong>
                </div>
              </div>
            </div>

            <div className="bg-gray-200 flex items-center p-2 my-4 rounded">
              <img src={time} alt="time" className="w-6 h-6 mr-2" />
              <span className="text-gray-700">
                Hạn nộp hồ sơ:{" "}
                {new Date(job.applicationDeadline).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              {applied ? (
                <div className="flex items-center bg-gray-100 justify-center text-green-500 font-bold py-2 px-4 rounded">
                  Đã ứng tuyển
                  <Check className="ml-2" size={24} />
                </div>
              ) : (
                <div>
                  {!job.expired ? (
                    <Link
                      to={`/candidate/application/${job._id}`}
                      className="flex items-center justify-center bg-green-500 text-white font-bold py-2 px-4 rounded"
                    >
                      <img src={share} alt="share" className="w-5 h-5 mr-2" />
                      Ứng tuyển ngay
                    </Link>
                  ) : (
                    <div className="flex items-center bg-gray-100 justify-center text-red-500 font-bold py-2 px-4 rounded">
                      <CalendarX2 className="mr-2" size={22} />
                      Hết hạn ứng tuyển
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => handleSaveJob(job._id)}
                className={`text-white py-2 px-4 rounded ${
                  savedJobs.includes(job._id)
                    ? "bg-white hover:bg-red-300"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {savedJobs.includes(job._id) ? (
                  <div className="text-red-600">
                    <HeartFilled /> Đã lưu
                  </div>
                ) : (
                  <div className="text-white">
                    <HeartOutlined /> Lưu
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white p-5 mt-5 rounded shadow-md">
            <h2 className="text-xl font-bold mb-2">Chi tiết tin tuyển dụng</h2>
            <div>
              <h3 className="text-lg font-semibold">Mô tả công việc</h3>
              <p>{job.description || "Không có mô tả công việc cho tin này"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mt-2">Địa điểm làm việc</h3>
              <p>{job.location}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mt-2">Hình thức làm việc</h3>
              <p>{job.workType}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mt-2">
                Cách thức ứng tuyển
              </h3>
              <p>
                Sinh viên ứng tuyển bằng cách bấm{" "}
                <strong>Ứng tuyển ngay</strong>{" "}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mt-6">
                Đánh giá nhà tuyển dụng
              </h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-3.5 p-5">
          <div className="bg-white p-5 rounded shadow-md">
            <div className="flex items-center mb-4">
              <img
                src={posterInfo?.avatar?.url || anhmau}
                alt="Company Logo"
                className="w-24 h-24 border-2 border-gray-300 rounded-full"
              />
              <h2 className="text-xl font-bold ml-4">
                {posterInfo?.companyName || "Tên công ty"}
              </h2>
            </div>
            <div className="text-gray-700 mb-2">Quy mô: {posterInfo?.numberOfEmployees || "Chưa cập nhật"}</div>
            <div className="text-gray-700 mb-2">Lĩnh vực: {posterInfo?.industry || "Chưa cập nhật"}</div>
            <div className="text-gray-700 mb-2">
              Địa chỉ: {posterInfo?.address || "Địa chỉ công ty"}
            </div>
            <Link to={`/candidate/company/${posterInfo?._id}`} className="text-green-500">
              Xem trang công ty
            </Link>
          </div>
          <div className="bg-white p-5 mt-5 rounded shadow-md">
            <h2 className="text-xl font-bold">Thông tin chung</h2>
            <div className="flex items-center my-2">
              <img src={level} alt="Cấp bậc" className="w-8 h-8 mr-2" />
              <div>
                <div className="text-gray-600">Cấp bậc</div>
                <div className="font-bold">{job.level}</div>
              </div>
            </div>
            <div className="flex items-center my-2">
              <img
                src={experience}
                alt="Kinh nghiệm"
                className="w-8 h-8 mr-2"
              />
              <div>
                <div className="text-gray-600">Kinh nghiệm</div>
                <div className="font-bold">{job.experience}</div>
              </div>
            </div>
            <div className="flex items-center my-2">
              <img
                src={numberpeople}
                alt="Số lượng tuyển"
                className="w-8 h-8 mr-2"
              />
              <div>
                <div className="text-gray-600">Số lượng tuyển</div>
                <div className="font-bold">{job.vacancies}</div>
              </div>
            </div>
            <div className="flex items-center my-2">
              <img src={gender} alt="Giới tính" className="w-8 h-8 mr-2" />
              <div>
                <div className="text-gray-600">Giới tính</div>
                <div className="font-bold">{job.gender}</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 mt-5 rounded shadow-md">
            <h2 className="text-xl font-bold">Kỹ năng cần có</h2>
            <h3 className="text-sm text-gray-500 font-bold">
              Độ phù hợp{" "}
              {calculateMatchPercentage(job.requiredSkills, user.skills)}%
            </h3>
            <div className="flex items-center my-2">
              {job.requiredSkills &&
                job.requiredSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="px-2 h-8 mr-2 rounded bg-gray-300"
                  >
                    {skill}
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-white p-5 mt-5 rounded shadow-md">
            <h2 className="text-xl font-bold">Thông tin khác</h2>
            <div className="flex items-center my-2">
              <img src={bell} alt="Thông báo" className="w-8 h-8 mr-2" />
              <div>
                <div className="text-gray-600">Ngày đăng</div>
                <div className="font-bold">
                  {new Date(job.jobPostedOn).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center my-2">
              <img src={time} alt="Thời gian" className="w-8 h-8 mr-2" />
              <div>
                <div className="text-gray-600">Hạn nộp hồ sơ</div>
                <div className="font-bold">
                  {new Date(job.applicationDeadline).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
