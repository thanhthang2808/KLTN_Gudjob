import axios from "axios";
import { useEffect, useState } from "react";
import avatarDefault from "@/assets/default-user.png";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const RecruiterProfile = () => {
    const [user, setUser] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [candidates, setCandidates] = useState([]);

    const getInfo = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/user/user-info`, {
                withCredentials: true,
            });
            setUser(response.data.user);
            setEditedUser(response.data.user);
        } catch (error) {
            console.error("Error fetching recruiter info:", error);
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
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating recruiter info:", error);
            setMessage('An error occurred while updating your information!');
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

        try {
            const response = await axios.put(
                `${API_URL}/api/user/update-avatar`,
                formData,
                {
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
        <div className="flex flex-col md:flex-row p-5 md:p-10 bg-gray-100 min-h-screen">
            {/* Left side for recruiter information */}
            <div className="w-full md:w-3/5 bg-white shadow-md rounded-lg p-6 mr-0 md:mr-10 mb-5 md:mb-0 transition-all duration-300 ease-in-out hover:shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Recruiter Information</h1>
                <div className="space-y-6">
                    {['name', 'phone', 'email'].map((field) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                            <input
                                type="text"
                                value={editedUser[field] || ""}
                                onChange={(e) => handleFieldChange(field, e.target.value)}
                                className={`w-full border border-gray-300 rounded-md p-2 transition duration-200 focus:border-blue-500 ${isEditing ? "bg-white" : "bg-gray-100"}`}
                                onClick={() => setIsEditing(true)}
                            />
                        </div>
                    ))}
                    {isEditing && (
                        <button
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                            onClick={saveChanges}
                        >
                            Save Changes
                        </button>
                    )}
                    {message && <p className="text-red-500">{message}</p>} {/* Notification for success/error */}
                </div>
            </div>

            {/* Right side for avatar and candidates list */}
            <div className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
                <div className="flex items-center">
                    <img
                        src={user?.avatar?.url || avatarDefault}
                        alt="Avatar"
                        className="w-32 h-32 rounded-full object-cover mb-4 cursor-pointer shadow-lg border-2 border-blue-500"
                        onClick={() => setIsModalOpen(true)} // Open modal when clicking on avatar
                    />
                    <div className="ml-4">
                        <h2 className="text-xl font-semibold text-gray-800">{user?.name}</h2>
                        <h3 className="text-md font-medium text-gray-600">{user?.companyName}</h3>
                    </div>
                </div>                
            </div>

            {/* Modal for updating avatar */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Update Avatar</h2>
                        <form onSubmit={handleAvatarUpdate}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mb-4 border rounded p-2"
                            />
                            <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
                                Update Avatar
                            </button>
                        </form>

                        {preview && (
                            <div className="mt-4">
                                <h4 className="text-gray-700">Preview Image:</h4>
                                <img src={preview} alt="Preview" className="mt-2 w-full h-auto rounded shadow-md" />
                            </div>
                        )}

                        {message && <p className="text-red-500">{message}</p>}

                        <button 
                            className="mt-4 text-red-500 font-medium" 
                            onClick={() => setIsModalOpen(false)} // Close modal
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterProfile;
