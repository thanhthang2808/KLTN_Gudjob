import React, { useEffect, useState } from 'react';
import { Users, Briefcase, FileText, PieChart, Building2 } from 'lucide-react';
import axios from 'axios';
import CountUp from 'react-countup';
import avt from '@/assets/default-user.png';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    totalCompanies: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [jobsResponse, candidatesResponse, companiesResponse, applicationsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/job/getall`, { withCredentials: true }),
          axios.get(`${API_URL}/api/user/total-candidate`, { withCredentials: true }),
          axios.get(`${API_URL}/api/user/total-company`, { withCredentials: true }),
          axios.get(`${API_URL}/api/application/total-applications`, { withCredentials: true }),
        ]);

        setStats({
          totalJobs: jobsResponse.data.jobs.length,
          totalCandidates: candidatesResponse.data.totalCandidate,
          totalCompanies: companiesResponse.data.totalCompany,
          totalApplications: applicationsResponse.data.totalApplications,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🎯 Bảng Điều Khiển Quản Trị</h1>
        <div className="flex items-center">
          <img src={avt} alt="Profile" className="w-12 h-12 rounded-full mr-2" />
          <span className="text-gray-800 font-semibold">Admin</span>
        </div>
      </div>

      {/* Thống Kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Briefcase className="w-12 h-12 text-blue-500 mr-4" />
          <div>
            <div className="text-2xl font-bold text-gray-800">
              <CountUp end={stats.totalJobs} duration={1} />
            </div>
            <div className="text-gray-600">Công Việc</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Users className="w-12 h-12 text-green-500 mr-4" />
          <div>
            <div className="text-2xl font-bold text-gray-800">
              <CountUp end={stats.totalCandidates} duration={1} />
            </div>
            <div className="text-gray-600">Ứng Viên</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <Building2 className="w-12 h-12 text-yellow-500 mr-4" />
          <div>
            <div className="text-2xl font-bold text-gray-800">
              <CountUp end={stats.totalCompanies} duration={1} />
            </div>
            <div className="text-gray-600">Công Ty</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <FileText className="w-12 h-12 text-red-500 mr-4" />
          <div>
            <div className="text-2xl font-bold text-gray-800">
              <CountUp end={stats.totalApplications} duration={1} />
            </div>
            <div className="text-gray-600">Hồ Sơ Ứng Tuyển</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;