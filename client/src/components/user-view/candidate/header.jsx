import { LogOut, Settings, Wallet, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import logo from "@/assets/logo-gudjob.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CandidateHeader() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_URL}/api/user/user-info`,
          { withCredentials: true }
        );
        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getInfo();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser()).then((data) => {
      toast({
        title: data?.payload?.message,
        variant: data?.payload?.success ? "success" : "destructive",
      });
    });
  };

  const formatAmount = (amount) =>
    amount ? `${parseInt(amount).toLocaleString("vi-VN")} VNĐ` : "0 VNĐ";

  return (
    <header className="flex items-center justify-between p-2 bg-[#00072D] text-white shadow-md fixed w-full z-50">
      {/* Sidebar Icon for Mobile */}
      <div className="md:hidden flex items-center">
        <Menu
          size={24}
          className="cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Logo Centered on Mobile */}
      <div
        onClick={() => navigate("/candidate/home")}
        className="cursor-pointer flex items-center justify-center flex-grow md:flex-grow-0"
      >
        <img src={logo} alt="Logo" className="w-16 h-auto" />
      </div>

      {/* Navigation Menu for Desktop */}
      <nav className="hidden md:flex space-x-4">
        {["Jobs", "Company", "My Applications", "Forum"].map((item) => (
          <button
            key={item}
            onClick={() => navigate(`/candidate/${item.toLowerCase().replace(" ", "")}`)}
            className="text-sm px-3 py-1 hover:bg-gray-800 rounded"
          >
            {item}
          </button>
        ))}
      </nav>

      {/* User Avatar on Right */}
      <div className="relative flex items-center md:space-x-2">
        <img
          src={userInfo?.avatar?.url || "/default-avatar.png"}
          alt="User Avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="absolute right-0 top-12 w-56 bg-white text-gray-800 rounded-lg shadow-lg z-50">
            <div className="flex items-center p-3 border-b">
              <img
                src={userInfo?.avatar?.url || "/default-avatar.png"}
                alt="Avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h2 className="text-sm font-semibold">
                  {userInfo?.name || "User"}
                </h2>
                <p className="text-xs text-gray-500">
                  {userInfo?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <ul className="text-sm">
              <li
                className="p-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/candidate/profile")}
              >
                <Settings size={16} /> Cài đặt thông tin cá nhân
              </li>
              <li
                className="p-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/candidate/mywallet")}
              >
                <Wallet size={16} /> Ví của tôi{" "}
                <span className="text-green-600">
                  {formatAmount(userInfo?.walletBalance)}
                </span>
              </li>
              <li
                className="p-2 hover:bg-red-100 text-red-600 flex items-center gap-2 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={16} /> Đăng xuất
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar Menu for Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden">
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg p-4">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600 mb-4"
            >
              Close
            </button>
            <nav className="flex flex-col space-y-2">
              {["Jobs", "Company", "My Applications", "Forum"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    navigate(`/candidate/${item.toLowerCase().replace(" ", "")}`);
                    setSidebarOpen(false);
                  }}
                  className="text-sm px-3 py-2 hover:bg-gray-200 rounded"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default CandidateHeader;
