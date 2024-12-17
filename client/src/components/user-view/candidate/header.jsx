import {
  LogOut,
  Settings,
  Wallet,
  Menu,
  ChevronDown,
  Search,
  FileText,
  Bookmark,
  Home,
  Bell,
  MessageCircle,
  ListChecks,
  KeyRound,
} from "lucide-react"; // Added icons for dropdown items
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import logo from "@/assets/logo-gudjob.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getTotalUnreadMessages } from "@/services/chat-service";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function CandidateHeader() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [walletBalance, setWalletBalance] = useState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    const getInfo = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/user/user-info`,
          { withCredentials: true }
        );
        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    getInfo();
  }, []);

  useEffect(() => {
    const getWallet = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/wallet/get-user-wallet`, {
          withCredentials: true,
        });
        setWalletBalance(response.data.wallet.balance);
      } catch (error) {
        console.error("Error fetching wallet info:", error);
      }
    };
    getWallet();
  }, []);

  useEffect(() => {
    const fetchTotalUnreadMessages = async () => {
      try {
        const unreadCount = await getTotalUnreadMessages();
        setTotalUnread(unreadCount); // Store the result in the state
      } catch (error) {
        console.error("Lỗi khi lấy số tin nhắn chưa đọc:", error);
      }
    };

    fetchTotalUnreadMessages(); // Call the service when the component mounts
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
        <div
          className="relative"
          onMouseEnter={() => setJobsDropdownOpen(true)}
          onMouseLeave={() => setJobsDropdownOpen(false)}
        >
          <div
            className="font-bold hover:text-green-500 text-sm px-3 h-full py-4 hover:bg-gray-800 rounded flex items-center cursor-pointer"
            onClick={() =>
              navigate("/candidate/search-results", {
                state: {
                  searchQuery: "",
                  selectedCategories: [],
                  location: "",
                },
              })
            }
          >
            Việc làm
          </div>
          {jobsDropdownOpen && (
            <div className="absolute bg-white text-gray-800 rounded-lg shadow-lg z-50  w-72">
              <ul className="text-sm">
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2 rounded-lg"
                  onClick={() =>
                    navigate("/candidate/search-results", {
                      state: {
                        searchQuery: "",
                        selectedCategories: [],
                        location: "",
                      },
                    })
                  }
                >
                  <Search size={16} /> Tìm việc
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2 rounded-lg"
                  onClick={() => navigate("/candidate/myapplications")}
                >
                  <FileText size={16} /> Việc làm đã ứng tuyển
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2 rounded-lg"
                  onClick={() => navigate("/candidate/saved-jobs")}
                >
                  <Bookmark size={16} /> Việc làm đã lưu
                </li>
                <li
                  className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2 rounded-lg"
                  onClick={() => navigate("/candidate/companies")}
                >
                  <Home size={16} /> Danh sách công ty
                </li>
              </ul>
            </div>
          )}
        </div>
        {/* <div className="flex items-center">
          <div className="h-10 border-l border-gray-100 hidden sm:block"></div>
        </div> */}

        <div
          onClick={() => navigate("/candidate/my-cv")}
          className="font-bold hover:text-green-500 text-sm px-3 h-full py-4 hover:bg-gray-800 rounded flex items-center cursor-pointer"
        >
          Hồ sơ của tôi
        </div>
        <div className="font-bold hover:text-green-500 text-sm px-3 h-full py-4 hover:bg-gray-800 rounded flex items-center cursor-pointer">
          Công cụ
        </div>
        <div
          onClick={() => navigate("/candidate/forum")}
          className="font-bold hover:text-green-500 text-sm px-3 h-full py-4 hover:bg-gray-800 rounded flex items-center cursor-pointer"
        >
          Diễn đàn
        </div>
      </nav>

      {/* User Avatar on Right */}
      <div className="relative flex items-center md:space-x-4 p-2">
        {/* Notification Button */}
        {/* <div className="relative cursor-pointer">
          <Bell size={24} className="text-gray-500 hover:text-gray-800" />
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
            3 
          </span>
        </div> */}

        {/* Messaging Button */}
        <div className="relative cursor-pointer" onClick={() => navigate("/conversation/")}>
          <MessageCircle
            size={24}
            className="text-gray-500 hover:text-gray-800"
          />
          {totalUnread > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full">
            {totalUnread}
          </span>
          )}
        </div>

        {/* User Avatar */}
        <div className="flex items-center cursor-pointer py-2" onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}>
        <img
          src={userInfo?.avatar?.url || "/default-avatar.png"}
          alt="User Avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
          
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
                  {userInfo?.name || "Người dùng"}
                </h2>
                <p className="text-xs text-gray-500">
                  {userInfo?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <ul className="text-sm">
            <li
                className="p-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/candidate/mywallet")}
              >
                <Wallet size={16} /> Ví của tôi{" "}
                <span className="text-green-600">
                  {formatAmount(walletBalance)}
                </span>
              </li>
              <li
                className="p-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/candidate/mytasks")}
              >
                <ListChecks size={16} /> Nhiệm vụ freelance
              </li>
              <li
                className="p-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/candidate/profile")}
              >
                <Settings size={16} /> Cài đặt thông tin cá nhân
              </li>
              <li
                className="p-2 hover:bg-gray-200 flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/candidate/security-settings")}
              >
                <KeyRound size={16} /> Cài đặt bảo mật
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
              {["Việc làm", "Công ty", "Đơn ứng tuyển", "Diễn đàn"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => {
                      navigate(
                        `/candidate/${item.toLowerCase().replace(" ", "")}`
                      );
                      setSidebarOpen(false);
                    }}
                    className="text-sm px-3 py-2 hover:bg-gray-200 rounded"
                  >
                    {item}
                  </button>
                )
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default CandidateHeader;
