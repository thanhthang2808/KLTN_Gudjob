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

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posterInfo, setPosterInfo] = useState(null);
  const [error, setError] = useState(false);
  const navigateTo = useNavigate();

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
        }
      })
      .catch(() => {
        setError(true);
        setLoading(false);
        navigateTo("/not-found");
      });
  }, [id, navigateTo]);

  // Loading state
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
            <h1 className="text-3xl font-bold mb-6">{job.title}</h1>
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
                  <strong className="text-lg">Không yêu cầu kinh nghiệm</strong>
                </div>
              </div>
            </div>

            <div className="bg-gray-200 flex items-center p-2 my-4 rounded">
              <img src={time} alt="time" className="w-6 h-6 mr-2" />
              <span className="text-gray-700">
                Ngày đăng: {new Date(job.jobPostedOn).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <Link
                to={`/candidate/application/${job._id}`}
                className="flex items-center justify-center bg-green-500 text-white font-bold py-2 px-4 rounded"
              >
                <img src={share} alt="share" className="w-5 h-5 mr-2" />
                Ứng tuyển ngay
              </Link>
              <button className="flex items-center bg-white justify-center border border-green-500 text-green-500 py-2 px-4 rounded">
                <img src={heartgreen} alt="save" className="w-5 h-5 mr-2" />
                Lưu tin
              </button>
            </div>
          </div>

          <div className="bg-white p-5 mt-5 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Chi tiết tin tuyển dụng</h2>
            <div>
              <h3 className="text-lg font-semibold">Mô tả công việc</h3>
              <p>{job.description || "Không có mô tả công việc cho tin này"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Yêu cầu ứng viên</h3>
              <p>- Chăm chỉ, cẩn thận</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Quyền lợi</h3>
              <p>- Hưởng nguyên lương trong thời gian thử việc.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Địa điểm làm việc</h3>
              <p>{job.location}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Cách thức ứng tuyển</h3>
              <p>
                Sinh viên ứng tuyển bằng cách bấm <strong>Ứng tuyển</strong>{" "}
                dưới đây
              </p>
              <button className="bg-green-500 text-white py-2 px-4 rounded">
                Ứng tuyển
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mt-6">Việc làm liên quan</h3>
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
            <div className="text-gray-700 mb-2">Quy mô: 10-24 nhân viên</div>
            <div className="text-gray-700 mb-2">Lĩnh vực: IT</div>
            <div className="text-gray-700 mb-2">
              Địa chỉ: {posterInfo?.address || "Địa chỉ công ty"}
            </div>
            <Link to="#" className="text-green-500">
              Xem trang công ty
            </Link>
          </div>
          <div className="bg-white p-5 mt-5 rounded shadow-md">
            <h2 className="text-xl font-bold">Thông tin chung</h2>
            <div className="flex items-center my-2">
              <img src={level} alt="Cấp bậc" className="w-8 h-8 mr-2" />
              <div>
                <div className="text-gray-600">Cấp bậc</div>
                <div className="font-bold">Nhân viên</div>
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
                <div className="font-bold">Không yêu cầu kinh nghiệm</div>
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
                <div className="font-bold">1 người</div>
              </div>
            </div>
            <div className="flex items-center my-2">
              <img src={gender} alt="Giới tính" className="w-8 h-8 mr-2" />
              <div>
                <div className="text-gray-600">Giới tính</div>
                <div className="font-bold">Nam/Nữ</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-5 mt-5 rounded shadow-md">
            <h2 className="text-xl font-bold">Kỹ năng cần có</h2>
            <div className="flex items-center my-2">
               <div className="px-2 h-8 mr-2 rounded bg-gray-300">Javascript</div> 
               <div className="px-2 h-8 mr-2 rounded bg-gray-300">SQL</div>            
            </div>
          </div>
          <div className="bg-white p-5 mt-5 rounded shadow-md">
            <h2 className="text-xl font-bold">Thông tin khác</h2>
            <div className="flex items-center my-2">
              <img src={bell} alt="Thông báo" className="w-8 h-8 mr-2" />
              <div>
                <div className="text-gray-600">Ngày đăng</div>
                <div className="font-bold">12/11/2024</div>
              </div>
            </div>
            <div className="flex items-center my-2">
              <img src={time} alt="Thời gian" className="w-8 h-8 mr-2" />
              <div>
                <div className="text-gray-600">Hạn nộp hồ sơ</div>
                <div className="font-bold">12/12/2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
