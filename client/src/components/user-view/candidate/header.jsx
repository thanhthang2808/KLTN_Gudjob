import { LogOut, User } from 'lucide-react';
import { Button } from '../../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/auth-slice';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import logo from '@/assets/logo-placeholder.png'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function UserHeader() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth); 
    const navigate = useNavigate(); 

    const handleLogout = () => {
        dispatch(logoutUser()).then((data) => {
            toast({
                title: data?.payload?.message,
                variant: data?.payload?.success ? 'success' : 'destructive',
            });
        });
    };

    const [userInfo, setUserInfo] = useState(null);
    const getInfo = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/api/user/user-info`, {
                withCredentials: true,
            });
            setUserInfo(response.data.user);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    useEffect(() => {
        getInfo();
    }, []);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleUserClick = () => {
        navigate('/candidate/profile'); 
    };

    const handleUserClickHome = () => {
        navigate('/candidate/home'); 
    };

    return (
        <header className="flex items-center justify-between max-w-full p-4 bg-gray-900 text-white shadow-md">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={handleUserClickHome}>
                <img src={logo} alt="Logo" className="w-20 h-auto" />
            </div>

            {/* Navigation Menu */}
            <nav className="flex-grow mx-10">
                <ul className="flex space-x-6">
                    {['Jobs', 'Company', 'Tools', 'Forum'].map((item) => (
                        <li key={item} className="relative group">
                            <button
                                onClick={() => setDropdownOpen((prev) => (prev === item ? '' : item))}
                                className="px-4 py-2 hover:bg-gray-700 rounded transition duration-150"
                            >
                                {item}
                            </button>
                            {dropdownOpen === item && (
                                <ul className="absolute left-0 mt-2 w-40 bg-gray-800 rounded shadow-lg">
                                    <li className="px-4 py-2 hover:bg-gray-700 transition duration-150">Submenu 1</li>
                                    <li className="px-4 py-2 hover:bg-gray-700 transition duration-150">Submenu 2</li>
                                    <li className="px-4 py-2 hover:bg-gray-700 transition duration-150">Submenu 3</li>
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Info and Logout Button */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center cursor-pointer" onClick={handleUserClick}>
                    <User size={24} className="mr-2" />
                    <span className="text-lg font-medium">{userInfo?.name || 'User'}</span>
                </div>
                <Button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
                >
                    <LogOut size={20} />
                    Đăng xuất
                </Button>
            </div>
        </header>
    );
}

export default UserHeader;
