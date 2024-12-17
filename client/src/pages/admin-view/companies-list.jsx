import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Lock, Trash, Unlock, Search } from "lucide-react"; // Importing icons
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 20;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/get-list-companies`, {
          withCredentials: true,
        });
        setCompanies(response.data.users);
        console.log("Companies:", response.data.users);
      } catch (err) {
        setError("Không thể lấy danh sách công ty.");
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleLockAccount = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "locked" ? "active" : "locked";
      await axios.put(
        `${API_URL}/api/user/lock/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setCompanies(
        companies.map((company) =>
          company._id === id ? { ...company, status: newStatus } : company
        )
      );
    } catch (err) {
      console.error("Error updating account status:", err);
    }
  };

  const handleDeleteAccount = async (companyId) => {
    try {
      await axios.delete(`${API_URL}/api/company/delete-company/${companyId}`, {
        withCredentials: true,
      });
      setCompanies(companies.filter((company) => company._id !== companyId));
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/admin/user-detail/${id}`);
  };

  const filteredCompanies = companies
    .filter((company) =>
      company.companyName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.companyName.localeCompare(b.companyName)
        : b.companyName.localeCompare(a.companyName)
    );

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);

  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Danh sách công ty
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-between mb-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên công ty"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded p-2 mr-2"
            />
            <Search className="text-gray-500" />
          </div>
          <div className="flex items-center">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border rounded p-2"
            >
              <option value="asc">Sắp xếp theo tên: A-Z</option>
              <option value="desc">Sắp xếp theo tên: Z-A</option>
            </select>
          </div>
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-4 text-left">Tên công ty</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Logo</th>
              <th className="px-6 py-4 text-left">Trạng thái</th>
              <th className="px-6 py-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentCompanies.length > 0 ? (
              currentCompanies.map((company) => (
                <tr key={company._id} className="border-b">
                  <td className="px-6 py-4">{company.companyName}</td>
                  <td className="px-6 py-4">{company.email}</td>
                  <td className="px-6 py-4">
                    <img
                      src={company.avatar?.url}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4">
                    {company.status === "locked" ? (
                      <span className="text-red-500">Bị khóa</span>
                    ) : (
                      <span className="text-green-500">Hoạt động</span>
                    )}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => handleViewDetails(company._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Xem chi tiết
                    </button>
                    {company.status === "locked" ? (
                      <button
                        onClick={() => handleLockAccount(company._id, company.status)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <Unlock className="inline-block mr-2" /> Mở khóa
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLockAccount(company._id, company.status)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        <Lock className="inline-block mr-2" /> Khóa
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAccount(company._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <Trash className="inline-block mr-2" /> Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  Không có công ty nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Trang trước
          </button>
          <span className="text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompaniesList;