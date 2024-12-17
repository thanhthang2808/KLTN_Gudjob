import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";
import CVPlaceholder from "@/assets/cv-default.png";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Application = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    coverLetter: "",
  });
  const [resume, setResume] = useState(null); 
  const [cvs, setCvs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedCv, setSelectedCv] = useState(null);

  const navigate = useNavigate();
  const { id: jobId } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/user-info`, {
          withCredentials: true,
        });
        const user = response.data.user;
        setFormData((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          phone: user.phone,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  // Fetch CVs
  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/get-mycv`, {
          withCredentials: true,
        });
        setCvs(response.data.cv || []);
      } catch (error) {
        console.error("Error fetching CVs:", error);
        toast.error("Failed to load CVs.");
      }
    };

    fetchCVs();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle CV selection
  const handleCVSelection = (e, cv) => {
    e.preventDefault(); // Ngăn việc submit form không mong muốn
    setSelectedCv(cv);
    setResume({ url: cv.url, public_id: cv.public_id });
    toast.success(`Selected CV: ${cv.name || "Unnamed CV"}`);
  };

  // Open modal for CV preview
  const handlePreviewCV = (cv) => {
    if (!cv.url) {
      toast.error("CV URL is invalid.");
      return;
    }
    setSelectedCv(cv);
    setIsModalOpen(true);
  };

  // Close CV preview modal
  const closeModal = () => setIsModalOpen(false);

  // Handle application submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      toast.error("Please select a CV before submitting.");
      return;
    }

    const payload = {
      ...formData,
      resume,
      jobId,
    };

    try {
      const { data } = await axios.post(
        `${API_URL}/api/application/post`,
        payload,
        {
          withCredentials: true,
        }
      );

      setIsSuccessModalOpen(true);
      toast.success(data.message);

      setTimeout(() => {
        navigate("/candidate/home");
        setIsSuccessModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <section className="application bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="container max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Application Form
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            name="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="address"
            placeholder="Your Address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="coverLetter"
            placeholder="Cover Letter..."
            value={formData.coverLetter}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 h-24"
          />

          {/* Select CV */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Select a CV:</label>
            <div className="grid grid-cols-2 gap-4">
              {cvs.map((cv) => (
                <div
                  key={cv._id}
                  className="relative p-2 border rounded-md cursor-pointer hover:border-gray-400"
                >
                  <img
                    src={cv.thumbnail || CVPlaceholder}
                    alt={cv.name || "CV"}
                    className="w-full h-32 object-cover rounded-md"
                    onClick={() => handlePreviewCV(cv)}
                  />
                  <p className="text-sm mt-2 text-center">
                    {cv.name || "Unnamed CV"}
                  </p>
                  <button
                    type="button" // Đảm bảo không submit form
                    onClick={(e) => handleCVSelection(e, cv)}
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 ${
                      resume?.public_id === cv.public_id
                        ? "bg-blue-500 border-blue-500"
                        : "bg-white border-gray-300"
                    } flex items-center justify-center`}
                    title="Select CV"
                  >
                    {resume?.public_id === cv.public_id && "✔"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit Application
          </button>
        </form>
      </div>

      {/* CV Preview Modal */}
      {selectedCv && isModalOpen && (
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
              title={selectedCv.name || "CV"}
              className="w-full h-[500px] border-none"
            />
          </div>
        </div>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onRequestClose={() => setIsSuccessModalOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            border: "none",
            borderRadius: "8px",
            textAlign: "center",
          },
        }}
      >
        <h2 className="text-xl font-semibold">Application Submitted!</h2>
        <p className="text-green-600">✅ Your application was successful.</p>
      </Modal>
    </section>
  );
};

export default Application;
