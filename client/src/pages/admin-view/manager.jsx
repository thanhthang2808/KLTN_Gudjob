import React from 'react';
import { User, Settings, ClipboardCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminManager() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Quản lý Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Quản lý tài khoản người dùng */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col items-center mb-4">
            <User className="h-12 w-12 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-200 w-full text-center pb-2">
              Quản lý tài khoản người dùng
            </h2>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onClick={() => navigate('/admin/list-users')}>
              Quản lý danh sách tài khoản người dùng
            </button>
          </div>
        </div>

        {/* Quản lý hệ thống */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col items-center mb-4">
            <Settings className="h-12 w-12 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-200 w-full text-center pb-2">
              Quản lý hệ thống
            </h2>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              Xem báo cáo thống kê
            </button>
            <button className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              Xem báo cáo vi phạm
            </button>
            <button className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              Sao lưu dữ liệu
            </button>
          </div>
        </div>

        {/* Quản lý bài đăng */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex flex-col items-center mb-4">
            <ClipboardCheck className="h-12 w-12 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-700 border-b border-gray-200 w-full text-center pb-2">
              Quản lý bài đăng
            </h2>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/admin/approve-post')}
              className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Duyệt bài đăng
            </button>
            <button
            onClick={() => navigate('/admin/post-manager')}
             className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
              Quản lý danh sách bài đăng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminManager;
