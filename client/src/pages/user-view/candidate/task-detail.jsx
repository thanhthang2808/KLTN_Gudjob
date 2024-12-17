import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { RatingModal } from "@/components/ui/rating-modal";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [submissionContent, setSubmissionContent] = useState("");
  const [files, setFiles] = useState([{ fileName: "", fileUrl: "" }]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/task/single-task/${id}`,
          { withCredentials: true }
        );
        setTask(response.data.task);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

  const handleAcceptTask = async () => {
    try {
      await axios.post(
        `${API_URL}/api/task/accept-task`,
        { taskId: id },
        { withCredentials: true }
      );
      alert("Task accepted successfully!");
      window.location.reload();
    } catch (err) {
      alert("Error accepting task: " + err.message);
    }
  };

  const handleDenyTask = async () => {
    if (!task || !task.payment?.amount || !task.employerId) {
      alert("Invalid task data. Cannot deny task.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/task/deny-task`,
        { taskId: id },
        { withCredentials: true }
      );
      alert("Task denied successfully!");

      try {
        await axios.put(
          `${API_URL}/api/wallet/unlock-wallet-balance`,
          {
            amount: task.payment.amount,
            userId: task.employerId,
            customId: task.customId,
          },
          { withCredentials: true }
        );
        console.log(
          "Refunded",
          task.payment.amount,
          "to employer",
          task.employerId
        );
      } catch (refundError) {
        console.error("Failed to refund payment:", refundError.message);
        alert(
          "Task rejected but failed to refund payment. Please contact support."
        );
      }

      window.location.reload();
    } catch (rejectError) {
      console.error("Error denying task:", rejectError.message);
      alert("Error denying task: " + rejectError.message);
    }
  };

  const handleFileChange = (index, field, value) => {
    const updatedFiles = [...files];
    updatedFiles[index][field] = value;
    setFiles(updatedFiles);
  };

  const addFileField = () => {
    setFiles([...files, { fileName: "", fileUrl: "" }]);
  };

  const handleSubmitTask = async () => {
    try {
      await axios.post(
        `${API_URL}/api/task/submit-task`,
        {
          taskId: id,
          submission: { content: submissionContent, files },
        },
        { withCredentials: true }
      );
      alert("Task submitted successfully!");
      setIsModalOpen(false);
      window.location.reload();
    } catch (err) {
      alert("Error submitting task: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!task) return <div>No task found.</div>;

  return (
    <div className="container mx-auto p-4">
      {task.customId && (
        <div className="text-gray-500 p-2 rounded text-sm">
          #{task.customId}
        </div>
      )}
      <h1 className="text-2xl font-bold">
        {task.title} - {task?.jobId?.title}
      </h1>
      <p className="text-gray-600 mt-2">{task.description}</p>
      <div className="mt-4 text-sm">
        <div>
          <strong>Trạng thái:</strong> {task.status}
        </div>
        <div className="flex items-center gap-4">
          {task.startDate && (
            <div>
              <strong>Ngày bắt đầu:</strong>{" "}
              {new Date(task.startDate).toLocaleDateString()}
            </div>
          )}
          <div>
            <strong>Deadline:</strong>{" "}
            {new Date(task.deadline).toLocaleDateString()}
          </div>
        </div>
        <div>
          <strong>Thanh toán:</strong> {task.payment.amount.toLocaleString()} VND -{" "}
          {task.payment?.status || "N/A"}
        </div>
        {task.submission.content && (
          <div className="mt-4 bg-gray-100 p-3 rounded">
            <strong>Nộp bài:</strong>
            <p className="text-gray-600 mt-2">{task.submission.content}</p>

            {task.submission.files && task.submission.files.length > 0 && (
              <div className="mt-2">
                <ul className="list-disc list-inside mt-1">
                  {task.submission.files.map((file, index) => (
                    <li key={index}>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {file.fileName || file.fileUrl}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-2">
              {new Date(task.submission.submittedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
      <div className="mt-6 flex items-center gap-4">
        {task.status === "Assigned" && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={handleAcceptTask}
          >
            Chấp nhận
          </button>
        )}
        {task.status === "Assigned" && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleDenyTask}
          >
            Từ chối
          </button>
        )}
        {task.status === "In Progress" && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            Nộp bài
          </button>
        )}
        {task.status === "Approved" && (
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={() => setIsReviewModalOpen(true)}
          >
            Đánh giá nhà tuyển dụng
          </button>
        )}
        {task.status === "Submitted" && (
          <div
            className="text-gray-400 px-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Đang chờ duyệt từ phía nhà tuyển dụng
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Submit Task</h2>
            <label className="block mb-2 font-medium">Content</label>
            <textarea
              className="w-full border rounded p-2 mb-4"
              value={submissionContent}
              onChange={(e) => setSubmissionContent(e.target.value)}
            ></textarea>

            <label className="block mb-2 font-medium">Files</label>
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="File Name"
                  className="w-1/2 border rounded p-2"
                  value={file.fileName}
                  onChange={(e) =>
                    handleFileChange(index, "fileName", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="File URL"
                  className="w-1/2 border rounded p-2"
                  value={file.fileUrl}
                  onChange={(e) =>
                    handleFileChange(index, "fileUrl", e.target.value)
                  }
                />
              </div>
            ))}
            <button
              className="bg-green-500 text-white px-3 py-1 rounded mb-4"
              onClick={addFileField}
            >
              + Add File
            </button>

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmitTask}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {isReviewModalOpen && (
        <RatingModal
          revieweeId={task.employerId}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskDetails;
