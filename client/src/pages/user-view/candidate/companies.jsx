import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Loading from "@/assets/loading-gif.gif";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading
  const navigate = useNavigate();
  const companiesPerPage = 9;

  // Fetch companies
  const fetchCompanies = async () => {
    setIsLoading(true); // Bắt đầu loading
    try {
      const { data } = await axios.get(`${API_URL}/api/user/get-companies`, {
        params: {
          page: currentPage,
          limit: companiesPerPage,
          search: searchQuery, // Gửi query search
        },
        withCredentials: true,
      });
      setCompanies(data.companies);
      setTotalCompanies(data.totalCompanies);
      setTotalPages(Math.ceil(data.totalCompanies / companiesPerPage));
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false); // Dừng loading
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, searchQuery]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
  };

  // Format job count
  const formatJobCount = (count) => {
    return `${count} công việc`;
  };

  // Navigate to company detail page
  const handleCompanyClick = (companyId) => {
    navigate(`/candidate/company/${companyId}`);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        Nhà Tuyển Dụng Hàng Đầu
      </h1>

      {/* Search Bar */}
      <div className="flex justify-center items-center mb-8">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên công ty..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
          <Search className="absolute top-2.5 left-3 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Loading GIF */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <img src={Loading} alt="Loading..." className="w-16 h-16" />
        </div>
      ) : (
        <>
          {/* Companies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div
                key={company._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-2 cursor-pointer"
                onClick={() => handleCompanyClick(company._id)}
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={company?.avatar?.url || "/default-avatar.png"}
                    alt={company.companyName}
                    className="w-24 h-24 rounded-full mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {company.companyName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{company.address}</p>
                  <p className="text-sm text-blue-500 font-medium">
                    {formatJobCount(company.jobCount || 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 ${
                  currentPage === 1 ? "disabled" : ""
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-gray-700">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className={`px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompaniesPage;
