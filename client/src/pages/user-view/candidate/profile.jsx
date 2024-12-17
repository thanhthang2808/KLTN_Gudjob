import axios from "axios";
import { useEffect, useState } from "react";
import avatarDefault from "@/assets/default-user.png";
import { PenSquareIcon, ShieldCheck, X } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const CandidateProfile = () => {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [isJobSeeking, setIsJobSeeking] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState(""); // State để lưu kỹ năng mới
  const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý modal
  const [loading, setLoading] = useState(false);

  const getInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/user-info`, {
        withCredentials: true,
      });
      setUser(response.data.user);
      setEditedUser(response.data.user);
      setSkills(response.data.user.skills || []);
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
      const response = await axios.put(`${API_URL}/api/user/update-candidate-info`, editedUser, {
        withCredentials: true,
      });
  
      if (response.data.success) {
        setUser(editedUser); 
        alert("Cập nhật thông tin thành công!");
        window.location.reload();
 
        setIsEditing(false); 
      } else {
        setMessage("Cập nhật thông tin không thành công. Vui lòng thử lại!"); 
      }
    } catch (error) {
      // Xử lý lỗi và thông báo cho người dùng
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin!";
      setMessage(errorMessage); // Cập nhật thông báo lỗi
    }
  };

  const sendVerificationEmail = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${API_URL}/api/auth/send-verification-email`, {
        email: user.email,
      });
      setMessage(response.data.message); // Hiển thị thông báo từ backend
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Error sending verification email.'
      );
    } finally {
      setLoading(false);
    }
  };
  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const handleSkillInput = (e) => {
    const input = e.target.value;

    // Kiểm tra xem có phẩy không
    if (input.endsWith(",")) {
        // Tách kỹ năng và thêm vào mảng skills
        const skillArray = input.slice(0, -1).trim().split(",").map(skill => skill.trim()).filter(skill => skill);
        setSkills([...skills, ...skillArray]); // Thêm kỹ năng mới vào danh sách
        setEditedUser(prev => ({ ...prev, skills: [...skills, ...skillArray] })); // Cập nhật skills trong editedUser
        setNewSkill(""); // Làm rỗng ô nhập
    } else {
        setNewSkill(input); // Cập nhật giá trị ô nhập
    }
};

const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    setEditedUser(prev => ({ ...prev, skills: updatedSkills })); // Cập nhật skills trong editedUser
};

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();

    if (!avatar) {
      setMessage("Please select an image to upload!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

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
        setMessage("Avatar updated successfully!");
        setPreview(null);
        setAvatar(null);
      } else {
        setMessage("An error occurred while updating the avatar!");
      }

      if (response.data.success) {
        // Refresh the page if the update is successful
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      setMessage("An error occurred while updating the avatar!");
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
            <label className="block text-sm font-medium text-gray-700">
              Tên
            </label>
            <input
              type="text"
              value={editedUser.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              className={`w-full border border-gray-300 rounded-md p-2 ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
              onClick={() => setIsEditing(true)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Số Điện Thoại
            </label>
            <input
              type="text"
              value={editedUser.phone || ""}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              className={`w-full border border-gray-300 rounded-md p-2 ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
              onClick={() => setIsEditing(true)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              value={editedUser.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              className={`w-full border border-gray-300 rounded-md p-2 ${
                isEditing ? "bg-white" : "bg-gray-100"
              }`}
              onClick={() => setIsEditing(true)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 flex items-center ">
              Kỹ năng
              <PenSquareIcon
                className="w-5 h-5 cursor-pointer bg-transparent ml-2"
                onClick={() => setIsEditing(true)}
              />
            </label>
            {/* Input for skills */}
            {isEditing && (
              <input
                type="text"
                value={newSkill}
                onChange={handleSkillInput} // Update the handler here
                placeholder="Nhập kỹ năng (cách nhau bởi dấu phẩy)"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            )}

            {/* Display added skills */}
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.length === 0 ? (
                <span className="text-gray-500">Chưa cập nhật kỹ năng</span>
              ) : (
                skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-blue-100 text-blue-600 px-3 py-1 rounded"
                  >
                    <span>{skill}</span>
                    <X
                      className="w-5 h-5 cursor-pointer bg-transparent"
                      onClick={() => removeSkill(index)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
          {isEditing && (
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={saveChanges}
            >
              Lưu Thay Đổi
            </button>
          )}
          {message && <p className="text-red-500">{message}</p>}{" "}
          {/* Thông báo lỗi/success */}
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
          {user?.isVerified === false ? (            
            <div className="relative group">               
                <ShieldCheck className="w-6 h-6 text-red-500 ml-2 cursor-pointer" onClick={sendVerificationEmail}/>
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-sm rounded-md py-2 px-3 shadow-lg z-50">
                    Gửi email xác thực
                </div>
            </div>
          ) : (
            <div className="relative group">
                {/* Icon */}
               
                <ShieldCheck className="w-6 h-6 text-green-500 ml-2" />

                {/* Tooltip */}
                <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:flex items-center justify-center bg-gray-800 text-white text-sm rounded-md py-2 px-3 shadow-lg z-50">
                    Tài khoản đã được xác thực
                </div>
            </div>
          )}
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
              <button
                type="submit"
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Cập nhật Avatar
              </button>
            </form>

            {preview && (
              <div>
                <h4>Ảnh Xem Trước:</h4>
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: "100%", height: "auto" }}
                />
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
