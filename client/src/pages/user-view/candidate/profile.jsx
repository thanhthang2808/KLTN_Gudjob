import axios from "axios";
import { useEffect, useState } from "react";
import avatarDefault from "@/assets/default-user.png";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const CandidateProfile = () => {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [isJobSeeking, setIsJobSeeking] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý modal

    const getInfo = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/user/user-info`, {
                withCredentials: true,
            });
            setUser(response.data.user);
            setEditedUser(response.data.user);
            setIsJobSeeking(response.data.user.isJobSeeking || false);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
    };

    const handleFieldChange = (field, value) => {
        setEditedUser({ ...editedUser, [field]: value });
    };

    const saveChanges = async () => {
        try {
            await axios.put(`${API_URL}/api/user/update-info`, editedUser, {
                withCredentials: true,
            });
            setUser(editedUser);
            setIsEditing(false);
            setMessage('Cập nhật thông tin thành công!');
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", error);
            setMessage('Có lỗi xảy ra khi cập nhật thông tin!');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
    };

    const handleAvatarUpdate = async (e) => {
        e.preventDefault();
    
        if (!avatar) {
            setMessage("Please select an image to upload!");
            return;
        }
    
        const formData = new FormData();
        formData.append('avatar', avatar);
    
        console.log("avatar:", avatar);
        try {
            const response = await axios.put(
                `${API_URL}/api/user/update-avatar`,
                formData,
                {
                    // headers: {
                    //     'Content-Type': 'multipart/form-data',
                    // },
                    withCredentials: true,
                }
            );

            if (response.data.avatar) {
                setUser((prevUser) => ({
                    ...prevUser,
                    avatar: response.data.avatar.url,
                }));
                setMessage('Avatar updated successfully!');
                setPreview(null);
                setAvatar(null);
            } else {
                setMessage('An error occurred while updating the avatar!');
            }

            if (response.data.success) {
                // Refresh the page if the update is successful
                window.location.reload();
              }
    
        } catch (error) {
            console.error("Error updating avatar:", error);
            setMessage('An error occurred while updating the avatar!');
        } finally {
            setIsModalOpen(false);
        }
    };
    
    

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <div className="flex flex-col md:flex-row p-5 md:p-10 justify-center">
            {/* Left side for user information */}
            <div className="w-full md:w-3/5 bg-white shadow-lg rounded-lg p-6 mr-0 md:mr-10 mb-5 md:mb-0">
                <h1 className="text-2xl font-bold mb-6">Thông Tin Người Dùng</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                        <input
                            type="text"
                            value={editedUser.name || ""}
                            onChange={(e) => handleFieldChange("name", e.target.value)}
                            className={`w-full border border-gray-300 rounded-md p-2 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số Điện Thoại</label>
                        <input
                            type="text"
                            value={editedUser.phone || ""}
                            onChange={(e) => handleFieldChange("phone", e.target.value)}
                            className={`w-full border border-gray-300 rounded-md p-2 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="text"
                            value={editedUser.email || ""}
                            onChange={(e) => handleFieldChange("email", e.target.value)}
                            className={`w-full border border-gray-300 rounded-md p-2 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                    {isEditing && (
                        <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={saveChanges}
                        >
                            Lưu Thay Đổi
                        </button>
                    )}
                    {message && <p className="text-red-500">{message}</p>} {/* Thông báo lỗi/success */}
                </div>
            </div>

            {/* Right side for avatar and job-seeking toggle */}
            <div className="w-full md:w-1/5 bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center">
                    <img
                        src={user?.avatar?.url || avatarDefault}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover mb-4 cursor-pointer shadow-lg"
                        onClick={() => setIsModalOpen(true)} // Mở modal khi nhấn vào avatar
                    />
                    <h2 className="text-lg font-semibold ml-4">{user?.name}</h2>
                </div>

                {/* Toggle switch for job seeking */}
                <div className="flex items-center mt-2">
                    <span className="mr-2">Tìm Việc:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only"
                            checked={isJobSeeking}
                            onChange={() => setIsJobSeeking(!isJobSeeking)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full shadow-inner"></div>
                        <div
                            className={`absolute left-0 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                                isJobSeeking ? "translate-x-full bg-green-500" : ""
                            }`}
                        ></div>
                    </label>
                </div>
            </div>

            {/* Modal for updating avatar */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h2 className="text-lg font-bold mb-4">Cập Nhật Avatar</h2>
                        <form onSubmit={handleAvatarUpdate}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mb-4"
                            />
                            <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Cập nhật Avatar
                            </button>
                        </form>

                        {preview && (
                            <div>
                                <h4>Ảnh Xem Trước:</h4>
                                <img src={preview} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                            </div>
                        )}

                        {message && <p className="text-red-500">{message}</p>}

                        <button 
                            className="mt-4 text-red-500" 
                            onClick={() => setIsModalOpen(false)} // Đóng modal
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandidateProfile;
