import { LogOut, User } from 'lucide-react';
import { Button } from '../../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/auth-slice';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import logo from '@/assets/logo-placeholder.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RecruiterHeader() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState('');

    // Hàm đăng xuất
    const handleLogout = async () => {
        const data = await dispatch(logoutUser());
        toast({
            title: data?.payload?.message,
            variant: data?.payload?.success ? 'success' : 'destructive',
        });
    };

    // Lấy thông tin người dùng
    const getUserInfo = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/user/user-info`, {
                withCredentials: true,
            });
            setUserInfo(response.data.user);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin người dùng:', error);
        }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    // Hàm điều hướng
    const handleNavigate = (path) => {
        navigate(path);
    };

    // Danh sách menu
    const menuItems = ['Candidate', 'My post', 'Tools', 'Forum'];

    return (
        <header className="flex items-center justify-between max-w-full p-4 bg-gray-900 text-white">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => handleNavigate('/recruiter/home')}>
                <img src={logo} alt="Logo" className="w-24 h-auto" />
            </div>

            {/* Menu chính */}
            <nav className="flex-grow mx-10">
                <ul className="hidden md:flex space-x-6">
                    {menuItems.map((item) => (
                        <li key={item} className="relative group">
                            <button
                                onClick={() => {
                                    if (item === 'My post') {
                                        handleNavigate('/recruiter/myposts');
                                    }
                                    if (item === 'Forum') {
                                        handleNavigate('/recruiter/forum');
                                    } else {
                                        setDropdownOpen((prev) => (prev === item ? '' : item));
                                    }
                                }}
                                className="px-4 py-2 hover:bg-gray-700 rounded-lg transition duration-200 ease-in-out"
                            >
                                {item}
                            </button>
                            {dropdownOpen === item  && item !== 'Forum' && (
                                <ul className="absolute left-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-10">
                                    {['Submenu 1', 'Submenu 2', 'Submenu 3'].map((submenu) => (
                                        <li key={submenu} className="px-4 py-2 hover:bg-gray-600 transition duration-150">{submenu}</li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Thông tin người dùng và nút Đăng xuất */}
            <div className="flex items-center space-x-4">
                <div
                    className="flex items-center cursor-pointer transition duration-200 hover:text-gray-400"
                    onClick={() => handleNavigate('/recruiter/profile')}
                >
                    <User size={24} className="mr-2" />
                    <span className="text-lg">{userInfo?.name || 'User'}</span>
                </div>
                <Button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
                >
                    <LogOut size={20} />
                    Đăng xuất
                </Button>
            </div>

            {/* Responsive Menu Button for Mobile */}
            <button className="md:hidden flex items-center p-2" onClick={() => setDropdownOpen((prev) => (prev ? '' : 'mobile'))}>
                <span className="text-white">Menu</span>
            </button>

            {/* Menu cho thiết bị di động */}
            {dropdownOpen === 'mobile' && (
                <nav className="absolute right-0 top-16 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
                    <ul className="flex flex-col">
                        {menuItems.map((item) => (
                            <li key={item}>
                                <button
                                    onClick={() => {
                                        if (item === 'My post') {
                                            handleNavigate('/recruiter/myposts');
                                        } else {
                                            setDropdownOpen('');
                                        }
                                    }}
                                    className="block px-4 py-2 hover:bg-gray-700 transition duration-200"
                                >
                                    {item}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
}

export default RecruiterHeader;
