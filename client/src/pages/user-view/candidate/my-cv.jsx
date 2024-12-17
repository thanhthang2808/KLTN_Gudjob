import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CV from "@/assets/cv-default.png";
import { Trash, UploadCloud } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const MyCV = () => {
  const [cvs, setCvs] = useState([]); // Mảng CV
  const [selectedCv, setSelectedCv] = useState(null); // CV đang được chọn để hiển thị modal
  const navigate = useNavigate(); // Dùng để điều hướng đến trang tải lên CV

  useEffect(() => {
    const fetchCVs = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/user/get-mycv`, {
            withCredentials: true,
          });
          setCvs(response.data.cv || []);
        } catch (error) {
          console.error("Lỗi khi gọi API:", error.response?.data || error.message);
          setCvs([]); // Gán giá trị mặc định nếu lỗi
        }
      };
      
    fetchCVs();
  }, []);

  // Hàm đóng modal
  const closeModal = () => setSelectedCv(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My CVs</h1>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-md mb-4"
        onClick={() => navigate("/candidate/update-cv")}
      >
        <UploadCloud className="w-6 h-6" />
      </button>
      {cvs && cvs.length === 0 ? (
        <p className="text-gray-600">Bạn chưa tải lên CV nào.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cvs.map((cv, index) => (
            <div
              key={cv._id || `cv-${index}`}
              className="relative border rounded-md shadow-md w-48 p-4 hover:shadow-lg cursor-pointer"
              onClick={() => setSelectedCv(cv)}
            >
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                {index + 1}
              </div>
              <div
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    await axios.delete(`${API_URL}/api/user/delete-cv/${cv._id}`, {
                      withCredentials: true,
                    });
                    setCvs((prev) => prev.filter((item) => item.id !== cv._id));
                    alert("Xóa CV thành công!");
                    window.location.reload();
                  } catch (error) {
                    console.log(cv._id);
                    console.error("Lỗi khi gọi API:", error.response?.data || error.message);
                  }
                }}
              >
                <Trash className="w-6 h-6" />
              </div>
              <img
                src={CV} // Đường dẫn thumbnail
                alt={`CV ${index + 1}`}
                className="w-full h-48  rounded-md"
              />
              <p className="mt-2 text-center text-sm font-medium">
                {cv.name || `CV ${index + 1}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal hiển thị CV */}
      {selectedCv && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[90%] max-w-3xl rounded-md shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <h3 className="text-lg font-semibold">
                {selectedCv.name || "Chi tiết CV"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <iframe
              src={`https://docs.google.com/gview?url=${selectedCv.url}&embedded=true`}
              title={selectedCv.name || `CV ${selectedCv.id}`}
              className="w-full h-[500px] border-none"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCV;
