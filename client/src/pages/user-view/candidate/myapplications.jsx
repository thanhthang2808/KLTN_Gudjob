import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "react-modal"; // Import react-modal
import { useNavigate } from "react-router-dom";
import PdfViewer from "@/components/common/pdf-viewer";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

// Modal styling (customized to limit size based on screen dimensions)
const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "0",
    backgroundColor: "transparent", // Transparent to remove default modal styling
    border: "none",
    maxWidth: "90vw", // Limits modal width to 90% of the viewport width
    maxHeight: "90vh", // Limits modal height to 90% of the viewport height
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)", // Dimmed background
  },
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      axios
        .get(`${API_URL}/api/application/candidate/getall`, {
          withCredentials: true,
        })
        .then((res) => {
          setApplications(res.data.applications);
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, []);

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`${API_URL}/api/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplications) =>
            prevApplications.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications py-8 px-4 sm:px-8 lg:px-16">
      <div className="container mx-auto">
        <h1 className="text-2xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
          My Applications
        </h1>
        {applications.length <= 0 ? (
          <div className="text-center py-8">
            <h4 className="text-xl text-gray-500">No Applications Found</h4>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((element) => (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Custom Modal for Resume Image */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        ariaHideApp={false} // Allows modal to work without an issue with ARIA
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

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  const isImage = element.resume.url.endsWith('.png') || 
                  element.resume.url.endsWith('.jpg') || 
                  element.resume.url.endsWith('.jpeg');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transform hover:-translate-y-2 transition-transform duration-300">
      <div className="detail space-y-2">
        <p className="text-lg font-semibold text-gray-700">
          <span className="font-bold text-gray-900">Name:</span> {element.name}
        </p>
        <p className="text-lg font-semibold text-gray-700">
          <span className="font-bold text-gray-900">Email:</span> {element.email}
        </p>
        <p className="text-lg font-semibold text-gray-700">
          <span className="font-bold text-gray-900">Phone:</span> {element.phone}
        </p>
        <p className="text-lg font-semibold text-gray-700">
          <span className="font-bold text-gray-900">Address:</span> {element.address}
        </p>
        <p className="text-lg font-semibold text-gray-700 truncate">
          <span className="font-bold text-gray-900">Cover Letter:</span> {element.coverLetter}
        </p>
      </div>

      <div className="mt-4">
        {isImage ? (
          <img
            src={element.resume.url}
            alt="resume"
            className="w-full h-48 object-cover rounded cursor-pointer"
            onClick={() => openModal(element.resume.url)}
          />
        ) : (
          <PdfViewer url={element.resume.url} />
        )}
      </div>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => deleteApplication(element._id)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
        >
          Delete Application
        </button>
      </div>
    </div>
  );
};

