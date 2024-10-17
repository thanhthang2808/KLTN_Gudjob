import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
    backgroundColor: "transparent",
    border: "none",
    maxWidth: "90vw",
    maxHeight: "90vh",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};

const ApplicationsFromCandidate = () => {
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/application/employer/getall`, {
          withCredentials: true,
        });
        setApplications(res.data.applications);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      }
    };

    fetchApplications();
  }, []);

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // New function to accept an application
  const acceptApplication = async (id) => {
    try {
      await axios.post(`${API_URL}/api/application/accept/${id}`, {}, { withCredentials: true });
      toast.success("Application accepted successfully!");
      refreshApplications(); // Refresh the applications list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept application");
    }
  };

  // New function to reject an application
  const rejectApplication = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/application/reject/${id}`, { withCredentials: true });
      toast.success("Application rejected successfully!");
      refreshApplications(); // Refresh the applications list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject application");
    }
  };

  // Function to refresh applications
  const refreshApplications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/application/employer/getall`, { withCredentials: true });
      setApplications(res.data.applications);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to refresh applications");
    }
  };

  return (
    <section className="recruiter_applications py-8 px-4 sm:px-8 lg:px-16">
      <div className="container mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
          Received Applications
        </h1>
        {applications.length <= 0 ? (
          <div className="text-center py-8">
            <h4 className="text-xl text-gray-500">No Applications Found</h4>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((element) => (
              <RecruiterApplicationCard
                element={element}
                key={element._id}
                openModal={openModal}
                acceptApplication={acceptApplication} // Pass accept function
                rejectApplication={rejectApplication} // Pass reject function
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        ariaHideApp={false}
      >
        <div className="relative">
          <img
            src={resumeImageUrl}
            alt="resume preview"
            className="w-full h-auto max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg"
          />
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-4 py-2"
          >
            Close
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default ApplicationsFromCandidate;

const RecruiterApplicationCard = ({ element, openModal, acceptApplication, rejectApplication }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-2 transition-transform duration-300">
      <div className="detail space-y-2">
        <p className="text-lg font-semibold text-gray-700">
          <span className="font-bold text-gray-900">Applicant Name:</span>{" "}
          {element.name}
        </p>
        <p className="text-lg font-semibold text-gray-700">
          <span className="font-bold text-gray-900">Email:</span>{" "}
          {element.email}
        </p>
        <p className="text-lg font-semibold text-gray-700">
          <span className="font-bold text-gray-900">Phone:</span>{" "}
          {element.phone}
        </p>
        <p className="text-lg font-semibold text-gray-700 truncate">
          <span className="font-bold text-gray-900">Cover Letter:</span>{" "}
          {element.coverLetter}
        </p>
      </div>
      <div className="mt-4">
        <img
          src={element.resume.url}
          alt="resume"
          className="w-full h-48 object-cover rounded cursor-pointer"
          onClick={() => openModal(element.resume.url)}
        />
      </div>
      <div className="mt-4 space-x-3 text-center">
        {element.status === "Processing" ? (
          <>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              onClick={() => acceptApplication(element._id)} // Accept application
            >
              Accept
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              onClick={() => rejectApplication(element._id)} // Reject application
            >
              Reject
            </button>
          </>
        ) : (
          <p
            className={`text-lg font-semibold ${
              element.status === "Accepted"
                ? "text-green-600" // Green for Accepted status
                : element.status === "Rejected"
                ? "text-red-600" // Red for Rejected status
                : "text-gray-700" // Default for other statuses
            }`}
          >
            <span className="font-bold text-gray-900">Status:</span>{" "}
            {element.status}
          </p>
        )}
      </div>
    </div>
  );
};
