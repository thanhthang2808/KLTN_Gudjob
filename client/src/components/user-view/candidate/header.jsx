import { LogOut, User } from "lucide-react";
import { Button } from "../../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import logo from "@/assets/logo-placeholder.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Settings, Wallet, FileText, Bell, Shield, Key } from "lucide-react"; // Thêm icon cần thiết

function CandidateHeader() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()).then((data) => {
      toast({
        title: data?.payload?.message,
        variant: data?.payload?.success ? "success" : "destructive",
      });
    });
  };

  const [userInfo, setUserInfo] = useState(null);
  const getInfo = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/api/user/user-info`,
        {
          withCredentials: true,
        }
      );
      setUserInfo(response.data.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    getInfo();
  }, []);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleUserClickHome = () => {
    navigate("/candidate/home");
  };

  const handleNavigation = (item) => {
    if (item === "My Applications") {
      navigate("/candidate/myapplications");
    } else {
      setDropdownOpen((prev) => (prev === item ? "" : item));
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setDropdownOpen(false);
    }, 2000);
  };

  return (
    <header className="flex items-center justify-between max-w-full p-4 bg-gray-900 text-white shadow-md">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer"
        onClick={handleUserClickHome}
      >
        <img src={logo} alt="Logo" className="w-20 h-auto" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow mx-10">
        <ul className="flex space-x-6">
          {["Jobs", "Company", "My Applications", "Forum"].map((item) => (
            <li key={item} className="relative group">
              <button
                onClick={() => handleNavigation(item)}
                className="px-4 py-2 hover:bg-gray-700 rounded transition duration-150"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info and Dropdown */}
      <div
        className="flex items-center space-x-4 relative"
        onMouseEnter={() => setDropdownOpen(true)}
        // onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center cursor-pointer">
          <img
            src={userInfo?.avatar?.url || "/default-avatar.png"}
            alt="Avatar"
            className="w-9 h-9 rounded-full mr-3"
          />
          <span className="text-lg font-medium">
            {userInfo?.name || "User"}
          </span>
        </div>
        {dropdownOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            {/* Thông tin người dùng */}
            <div className="flex items-center text-gray-800 p-4 border-b border-gray-300 bg-gray-100">
              <img
                src={userInfo?.avatar?.url || "/default-avatar.png"}
                alt="Avatar"
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <h2 className="text-md font-semibold">
                  {userInfo?.name || "User"}
                </h2>
                <p className="text-sm text-gray-500">
                  {userInfo?.email || "user@example.com"}
                </p>
              </div>
            </div>
            {/* Các tùy chọn */}
            <ul className="p-2">
              <li className="flex items-center text-gray-600 gap-2 p-2 hover:bg-gray-200 transition duration-150 cursor-pointer">
                <Settings size={20} />
                <span>Cài đặt thông tin cá nhân</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-200 transition duration-150 cursor-pointer">
                <Wallet size={20} />
                <span>Ví của tôi</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-200 transition duration-150 cursor-pointer">
                <FileText size={20} />
                <span>CV của tôi</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-200 transition duration-150 cursor-pointer">
                <Bell size={20} />
                <span>Cài đặt thông báo</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-200 transition duration-150 cursor-pointer">
                <Shield size={20} />
                <span>Cài đặt bảo mật</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-200 transition duration-150 cursor-pointer">
                <Key size={20} />
                <span>Đổi mật khẩu</span>
              </li>
              <li
                className="flex items-center gap-2 p-2 hover:bg-red-200 transition duration-150 cursor-pointer text-red-600"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span>Đăng xuất</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

export default CandidateHeader;
