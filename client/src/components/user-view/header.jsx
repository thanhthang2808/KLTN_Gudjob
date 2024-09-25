import { LogOut, User } from 'lucide-react';
import { Button } from '../ui/button'; // Giả sử bạn đã định nghĩa thành phần Button
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/auth-slice';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import logo from '@/assets/logo-placeholder.png'; // Import logo here

function UserHeader() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth); 

    const handleLogout = () => {
        dispatch(logoutUser()).then((data) => {
            if (data?.payload?.success) {
                toast({
                    title: data?.payload?.message,
                    type: 'success',
                });
            } else {
                toast({
                    title: data?.payload?.message,
                    variant: 'destructive',
                });
            }
        });
    };

    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
            {/* Logo */}
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-20 h-auto" /> {/* Sử dụng biến logo */}
            </div>

            {/* Dropdown Menus */}
            <nav className="flex-grow mx-10">
                <ul className="flex space-x-4">
                    {['Jobs', 'Company', 'Tools', 'Forum'].map((item) => (
                        <li key={item} className="relative group">
                            <button
                                onClick={() => setDropdownOpen((prev) => (prev === item ? '' : item))}
                                className="px-4 py-2 hover:bg-gray-700 rounded"
                            >
                                {item}
                            </button>
                            {dropdownOpen === item && (
                                <ul className="absolute left-0 mt-2 w-32 bg-gray-700 rounded shadow-lg">
                                    <li className="px-4 py-2 hover:bg-gray-600">Submenu 1</li>
                                    <li className="px-4 py-2 hover:bg-gray-600">Submenu 2</li>
                                    <li className="px-4 py-2 hover:bg-gray-600">Submenu 3</li>
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Info and Logout Button */}
            <div className="flex items-center space-x-4">
                <div className="flex items-center">
                    <User size={24} className="mr-2" />
                    <span className="text-lg">{user?.userName || 'User'}</span>
                </div>
                <Button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition duration-200"
                >
                    <LogOut size={20} />
                    Logout
                </Button>
            </div>
        </header>
    );
}

export default UserHeader;
