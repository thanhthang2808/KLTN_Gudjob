import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LucideVote, X } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [vacancies, setVacancies] = useState();
  const [gender, setGender] = useState("Tất cả");
  const [description, setDescription] = useState("");
  const [applicationDeadline, setApplicationDeadline] = useState();
  const [category, setCategory] = useState("");
  const [workType, setWorkType] = useState("Dài hạn");
  const [level, setLevel] = useState("Thực tập sinh");
  const [experience, setExperience] = useState("Không yêu cầu kinh nghiệm");
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
              vacancies,
              gender,
              description,
              requiredSkills,
              category,
              workType,
              level,
              experience,
              country,
              city,
              location,
              fixedSalary,
              applicationDeadline,
            }
          : {
              title,
              vacancies,
              gender,
              description,
              requiredSkills,
              category,
              workType,
              level,
              experience,
              country,
              city,
              location,
              salaryFrom,
              salaryTo,
              applicationDeadline,
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
      console.error(err.response?.data.message || "Có lỗi xảy ra!");
      toast.error(err.response?.data.message || "Có lỗi xảy ra!");
    }
  };

  const resetForm = () => {
    setTitle("");
    setVacancies("");
    setGender("");
    setDescription("");
    setRequiredSkills([]);
    setCategory("");
    setWorkType("");
    setLevel("");
    setExperience("");
    setCountry("");
    setCity("");
    setLocation("");
    setSalaryFrom("");
    setSalaryTo("");
    setFixedSalary("");
    setSalaryType("default");
    setApplicationDeadline("");
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
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h3 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Post New Job
        </h3>
        <form onSubmit={handleJobPost} className="space-y-6">
          {/* Job Title */}
          <div className="grid grid-cols-6 gap-4">
            {/* Job Title */}
            <div className="col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Job Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter Job Title"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Vacancies */}
            <div className="col-span-1">
              <label
                htmlFor="vacancies"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Vacancies
              </label>
              <input
                type="number"
                id="vacancies"
                value={vacancies}
                onChange={(e) => setVacancies(e.target.value)}
                placeholder="Enter Number of Vacancies"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
            </div>
            <div className="col-span-1">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
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

          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
            {/* Work Type, Level & Experience  */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Type
              </label>
              <select
                id="workType"
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Dài hạn">Dài hạn</option>
                <option value="Ngắn hạn">Ngắn hạn</option>
                <option value="Tự do">Tự do</option>
                <option value="Thực tập">Thực tập</option>
              </select>
            </div>
            {workType !== "Tự do" && (<div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Thực tập sinh">Thực tập sinh</option>
                <option value="Nhân viên Mới">Nhân viên Mới</option>
                <option value="Nhân viên">Nhân viên</option>
                <option value="Nhân viên Cấp cao">Nhân viên Cấp cao</option>
                <option value="Trưởng nhóm">Trưởng nhóm</option>
              </select>
            </div>)}
            {workType !== "Tự do" && (<div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <select
                id="experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Không yêu cầu kinh nghiệm">
                  Không yêu cầu kinh nghiệm
                </option>
                <option value="Dưới 1 năm">Dưới 1 năm</option>
                <option value="1 năm">1 năm</option>
                <option value="2 năm">2 năm</option>
                <option value="3 năm">3 năm</option>
                <option value="4 năm">4 năm</option>
                <option value="5 năm">5 năm</option>
                <option value="Trên 5 năm">Trên 5 năm</option>
              </select>
            </div>)}
          </div>

          {/* Country & City */}
          {workType !== "Tự do" && (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Country
              </label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Enter Country"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>)}

          {/* Location */}
          {workType !== "Tự do" && (<div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Location"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>)}

          {/* Salary Type */}
          <div>
            <label
              htmlFor="salaryType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Salary Type
            </label>
            <select
              id="salaryType"
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

          {/* Fixed or Ranged Salary */}
          {salaryType === "Fixed Salary" && (
            <div>
              <label
                htmlFor="fixedSalary"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fixed Salary
              </label>
              <input
                type="number"
                id="fixedSalary"
                placeholder="Enter Fixed Salary"
                value={fixedSalary}
                onChange={(e) => setFixedSalary(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          {salaryType === "Ranged Salary" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="salaryFrom"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Salary From
                </label>
                <input
                  type="number"
                  id="salaryFrom"
                  placeholder="Enter Minimum Salary"
                  value={salaryFrom}
                  onChange={(e) => setSalaryFrom(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="salaryTo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Salary To
                </label>
                <input
                  type="number"
                  id="salaryTo"
                  placeholder="Enter Maximum Salary"
                  value={salaryTo}
                  onChange={(e) => setSalaryTo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          )}

          {/* Required Skills */}
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Required Skills
            </label>
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

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Description
            </label>
            <textarea
              id="description"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Job Description"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Application Deadline */}
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="applicationDeadline"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Application Deadline
              </label>
              <input
                type="date"
                id="applicationDeadline"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                min={new Date().toISOString().split("T")[0]} // Tự động đặt min là ngày hôm nay
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
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
