import axios from "axios";
import { CirclePlus } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const MyPosts = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigateTo = useNavigate();

  // Fetching all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/job/getmyjobs`, {
          withCredentials: true,
        });
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, []);

  // Function for enabling editing mode
  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  // Function for disabling editing mode
  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  // Function for updating the job
  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    await axios
      .put(`${API_URL}/api/v1/job/update/${jobId}`, updatedJob, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setEditingMode(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  // Function for deleting job
  const handleDeleteJob = async (jobId) => {
    try {
      const res = await axios.delete(`${API_URL}/api/job/delete/${jobId}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : "Có lỗi xảy ra trong quá trình xóa công việc!");
    }
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <div className="myJobs page bg-gray-100 min-h-screen p-5">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Posted Jobs</h1>
        {/* New Post Button */}
        <div className="mb-4">
          <Link to="/recruiter/postjob">
            <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
              New Post 
              <CirclePlus size={20} className="inline-block ml-2" />
            </button>
          </Link>
        </div>
        
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded shadow-md">
              <p className="text-lg font-semibold">Xóa công việc thành công!</p>
            </div>
          </div>
        )}

        {myJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myJobs.map((element) => (
              <div className="card bg-white shadow-lg rounded-lg p-5" key={element._id}>
                <div className="content">
                  <div className="short_fields">
                    {['title', 'country', 'city'].map((field) => (
                      <div className="mb-3" key={field}>
                        <label className="block text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element[field]}
                          onChange={(e) => handleInputChange(element._id, field, e.target.value)}
                          className="mt-1 block w-full border rounded-md p-2"
                        />
                      </div>
                    ))}
                    <div className="mb-3">
                      <label className="block text-gray-700">Category:</label>
                      <select
                        value={element.category}
                        onChange={(e) => handleInputChange(element._id, "category", e.target.value)}
                        disabled={editingMode !== element._id}
                        className="mt-1 block w-full border rounded-md p-2"
                      >
                        {["Graphics & Design", "Mobile App Development", "Frontend Web Development", "MERN Stack Development", "Account & Finance", "Artificial Intelligence", "Video Animation", "MEAN Stack Development", "MEVN Stack Development", "Data Entry Operator"].map(option => (
                          <option value={option} key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-700">Salary:</label>
                      {element.fixedSalary ? (
                        <input
                          type="number"
                          disabled={editingMode !== element._id}
                          value={element.fixedSalary}
                          onChange={(e) => handleInputChange(element._id, "fixedSalary", e.target.value)}
                          className="mt-1 block w-full border rounded-md p-2"
                        />
                      ) : (
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            disabled={editingMode !== element._id}
                            value={element.salaryFrom}
                            onChange={(e) => handleInputChange(element._id, "salaryFrom", e.target.value)}
                            className="mt-1 block w-full border rounded-md p-2"
                          />
                          <input
                            type="number"
                            disabled={editingMode !== element._id}
                            value={element.salaryTo}
                            onChange={(e) => handleInputChange(element._id, "salaryTo", e.target.value)}
                            className="mt-1 block w-full border rounded-md p-2"
                          />
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-700">Expired:</label>
                      <select
                        value={element.expired}
                        onChange={(e) => handleInputChange(element._id, "expired", e.target.value)}
                        disabled={editingMode !== element._id}
                        className="mt-1 block w-full border rounded-md p-2"
                      >
                        <option value={true}>TRUE</option>
                        <option value={false}>FALSE</option>
                      </select>
                    </div>
                  </div>
                  <div className="long_field mb-3">
                    <div className="mb-3">
                      <label className="block text-gray-700">Description:</label>
                      <textarea
                        rows={5}
                        value={element.description}
                        disabled={editingMode !== element._id}
                        onChange={(e) => handleInputChange(element._id, "description", e.target.value)}
                        className="mt-1 block w-full border rounded-md p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700">Location:</label>
                      <textarea
                        value={element.location}
                        rows={5}
                        disabled={editingMode !== element._id}
                        onChange={(e) => handleInputChange(element._id, "location", e.target.value)}
                        className="mt-1 block w-full border rounded-md p-2"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    {editingMode === element._id ? (
                      <button
                        onClick={() => handleUpdateJob(element._id)}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnableEdit(element._id)}
                        className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteJob(element._id)}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">You have not posted any jobs yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
