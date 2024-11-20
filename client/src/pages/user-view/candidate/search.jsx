import React, { useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function CandidateSearch() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [location, setLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showWorkTypeDropdown, setShowWorkTypeDropdown] = useState(false);
  const [workType, setWorkType] = useState("");

  const categories = [
    "Kinh doanh/Bán hàng",
    "Marketing/PR/Quảng cáo",
    "Dịch vụ khách hàng/Vận hành",
    "Nhân sự/Hành chính",
    "Tài chính/Ngân hàng",
    "Công nghệ Thông tin",
    "Bất động sản/Xây dựng",
    "Kế toán/Kiểm toán/Thuế",
    "Sản xuất",
    "Giáo dục/Đào tạo",
    "Điện/Điện tử/Viễn thông",
    "Logistics",
    "Luật",
    "Dược/Y tế/Sức khỏe",
    "Thiết kế",
    "Nhà hàng/Khách sạn/Du lịch",
    "Năng lượng/Môi trường/Nông nghiệp",
    "Khác",
  ];
  const locations = ["", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Khác"];
  const workTypes = ["Dài hạn", "Ngắn hạn"];

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleLocationChange = (event) => {
    const selectedLocation = event.target.value;
    setLocation(selectedLocation);
    if (selectedLocation !== "Khác") {
      setShowLocationDropdown(false);
    }
    if (selectedLocation === "Khác") {
      setCustomLocation("");
    }
  };

  const handleSearch = () => {
    navigate("/candidate/search-results", {
      state: {
        searchQuery,
        selectedCategories,
        location: location === "Khác" ? customLocation : location,
        workType,
      },
    });
  };

  return (
    <div className="flex items-center mt-2 w-full">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 p-4 bg-white shadow-lg rounded-lg max-w-[80%] w-full mx-auto">
        {/* Search Input */}
        <div className="flex items-center w-full sm:w-auto border border-gray-300 rounded-lg p-2">
          <Search className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Tìm kiếm công việc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none text-gray-700 bg-white"
          />
        </div>

        <div className="h-10 border-l border-gray-300 mx-2 hidden sm:block"></div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowCategoryDropdown((prev) => !prev)}
            className="flex items-center bg-white rounded-lg p-2 w-full sm:w-auto text-gray-700"
          >
            <Briefcase className="text-gray-500 mr-2" />
            <span>
              {selectedCategories.length > 0
                ? `Danh mục nghề (${selectedCategories.length})`
                : "Danh mục nghề"}
            </span>
            <ChevronDown className="ml-2" />
          </button>
          {showCategoryDropdown && (
            <div className="absolute mt-2 left-0 right-0 sm:w-64 bg-white border border-gray-300 rounded-lg shadow-md p-2 z-10 max-h-60 overflow-y-auto">
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-sm text-white bg-red-500 hover:bg-gray-700 rounded-lg p-1 mr-2"
                >
                  Xóa tất cả
                </button>
                <button
                  onClick={() => setShowCategoryDropdown(false)}
                  className="text-sm text-white bg-green-500 hover:bg-gray-700 rounded-lg p-1"
                >
                  Xong
                </button>
              </div>
              <div>
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center cursor-pointer mb-1 text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="mr-2"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-10 border-l border-gray-300 mx-2 hidden sm:block"></div>

        {/* Location Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowLocationDropdown((prev) => !prev)}
            className="flex items-center border bg-white rounded-lg p-2 w-full sm:w-auto text-gray-700"
          >
            <MapPin className="text-gray-500 mr-2" />
            {location === "Khác" && customLocation
              ? customLocation
              : location || "Tất cả"}
            <ChevronDown className="ml-2" />
          </button>
          {showLocationDropdown && (
            <div className="absolute mt-2 left-0 right-0 sm:w-48 bg-white border border-gray-300 rounded-lg shadow-md p-2 z-10">
              <select
                value={location}
                onChange={handleLocationChange}
                className="w-full p-2 border-b border-gray-300 mb-2 outline-none text-gray-700"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              {location === "Khác" && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Nhập địa điểm"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none text-gray-700"
                  />
                  <ChevronRight
                    className="text-green-500 cursor-pointer"
                    onClick={() => setShowLocationDropdown(false)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-10 border-l border-gray-300 mx-2 hidden sm:block"></div>

        {/* WorkType Dropdown */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setShowWorkTypeDropdown((prev) => !prev)}
            className="flex items-center bg-white rounded-lg p-2 w-full sm:w-auto text-gray-700"
          >
            <span>{workType || "Loại công việc"}</span>
            <ChevronDown className="ml-2" />
          </button>
          {showWorkTypeDropdown && (
            <div className="absolute mt-2 left-0 right-0 sm:w-48 bg-white border border-gray-300 rounded-lg shadow-md p-2 z-10">
              {workTypes.map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    setWorkType(type);
                    setShowWorkTypeDropdown(false);
                  }}
                  className="p-2 hover:bg-gray-200 cursor-pointer rounded"
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-10 border-l border-gray-300 mx-2 hidden sm:block"></div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full sm:w-auto bg-green-500 text-white font-semibold rounded-lg p-2 hover:bg-green-600 transition"
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  );
}

export default CandidateSearch;
