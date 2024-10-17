import axios from "axios";
import React, { useEffect, useState } from "react"; // import useEffect
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "react-modal";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigateTo = useNavigate();
  const { id } = useParams();

  // Use useEffect to fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/user/user-info`, {
          withCredentials: true,
        });
        const user = response.data.user;

        // Set user data to state
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (event) => {
    const selectedResume = event.target.files[0];
    setResume(selectedResume);
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Please select a resume file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(
        `${API_URL}/api/application/post`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form fields
      setCoverLetter("");
      setAddress("");
      setResume(null);

      // Open success modal
      setIsModalOpen(true);

      // Navigate to home after 2 seconds
      setTimeout(() => {
        navigateTo("/candidate/home");
        setIsModalOpen(false);
      }, 2000);

      toast.success(data.message);
    } catch (error) {
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  Modal.setAppElement('#root');

  return (
    <section className="application bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="container max-w-lg bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4 text-center">Application Form</h3>
        <form onSubmit={handleApplication} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Cover Letter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
          />
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Resume
            </label>
            <input
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Send Application
          </button>
        </form>

        {/* Success Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
              border: 'none',
              borderRadius: '8px',
              background: 'white',
              textAlign: 'center',
            },
          }}
        >
          <h2 className="text-xl font-semibold">Application Submitted!</h2>
          <p className="text-2xl text-green-600">✅ Your application has been successfully submitted.</p>
        </Modal>
      </div>
    </section>
  );
};

export default Application;
