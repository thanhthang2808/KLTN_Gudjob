import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LucideVote, X } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleJobPost = async (e) => {
    e.preventDefault();

    // Reset salary fields based on salaryType
    if (salaryType === "Fixed Salary") {
      setSalaryFrom("");
      setSalaryTo("");
    } else if (salaryType === "Ranged Salary") {
      setFixedSalary("");
    } else {
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
    }

    try {
      const jobData =
        salaryType === "Fixed Salary"
          ? {
              title,
              description,
              requiredSkills,
              category,
              country,
              city,
              location,
              fixedSalary,
            }
          : {
              title,
              description,
              requiredSkills,
              category,
              country,
              city,
              location,
              salaryFrom,
              salaryTo,
            };

      const res = await axios.post(`${API_URL}/api/job/post`, jobData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Show success modal
      setShowModal(true);
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/recruiter/myposts"); // Redirect to my posts after 1 second
      }, 1000);

      // Reset fields after successful submission
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data.message || "Có lỗi xảy ra!");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRequiredSkills([]);
    setCategory("");
    setCountry("");
    setCity("");
    setLocation("");
    setSalaryFrom("");
    setSalaryTo("");
    setFixedSalary("");
    setSalaryType("default");
  };

  const handleSkillAdd = (e) => {
    if (e.key === "," && e.target.value.trim() !== "") {
      e.preventDefault();
      const skills = e.target.value
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill); // Tách chuỗi kỹ năng
      setRequiredSkills((prev) => [...new Set([...prev, ...skills])]); // Thêm kỹ năng mới vào mảng (loại bỏ trùng lặp)
      e.target.value = ""; // Xóa ô nhập
    }
  };

  const handleSkillRemove = (index) => {
    setRequiredSkills((prev) => prev.filter((_, i) => i !== index)); // Xóa kỹ năng theo chỉ mục
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h3 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Post New Job
        </h3>
        <form onSubmit={handleJobPost}>
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Kinh doanh/Bán hàng">Kinh doanh/Bán hàng</option>
              <option value="Marketing/PR/Quảng cáo">
                Marketing/PR/Quảng cáo
              </option>
              <option value="Dịch vụ khách hàng/Vận hành">
                Dịch vụ khách hàng/Vận hành
              </option>
              <option value="Nhân sự/Hành chính">Nhân sự/Hành chính</option>
              <option value="Tài chính/Ngân hàng">Tài chính/Ngân hàng</option>
              <option value="Công nghệ Thông tin">Công nghệ Thông tin</option>
              <option value="Bất động sản/Xây dựng">
                Bất động sản/Xây dựng
              </option>
              <option value="Kế toán/Kiểm toán/Thuế">
                Kế toán/Kiểm toán/Thuế
              </option>
              <option value="Sản xuất">Sản xuất</option>
              <option value="Giáo dục/Đào tạo">Giáo dục/Đào tạo</option>
              <option value="Điện/Điện tử/Viễn thông">
                Điện/Điện tử/Viễn thông
              </option>
              <option value="Logistics">Logistics</option>
              <option value="Luật">Luật</option>
              <option value="Dược/Y tế/Sức khỏe">Dược/Y tế/Sức khỏe</option>
              <option value="Thiết kế">Thiết kế</option>
              <option value="Nhà hàng/Khách sạn/Du lịch">
                Nhà hàng/Khách sạn/Du lịch
              </option>
              <option value="Năng lượng/Môi trường/Nông nghiệp">
                Năng lượng/Môi trường/Nông nghiệp
              </option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <select
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="default">Select Salary Type</option>
              <option value="Fixed Salary">Fixed Salary</option>
              <option value="Ranged Salary">Ranged Salary</option>
            </select>
          </div>
          <div className="mb-4">
            {salaryType === "Fixed Salary" && (
              <input
                type="number"
                placeholder="Enter Fixed Salary"
                value={fixedSalary}
                onChange={(e) => setFixedSalary(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
            {salaryType === "Ranged Salary" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Salary From"
                  value={salaryFrom}
                  onChange={(e) => setSalaryFrom(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Salary To"
                  value={salaryTo}
                  onChange={(e) => setSalaryTo(e.target.value)}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <input
              type="text"
              onKeyDown={handleSkillAdd} // Xử lý thêm kỹ năng
              placeholder="Required Skills (Separate by comma)"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2">
              {requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-blue-200 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded"
                >
                  {skill}
                  <X
                    className="h-4 w-4 ml-1 cursor-pointer"
                    onClick={() => handleSkillRemove(index)}
                  />
                </span>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <textarea
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job Description"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Job
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <h2 className="text-lg font-semibold">Success!</h2>
            <p className="mt-2">Job posted successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostJob;
