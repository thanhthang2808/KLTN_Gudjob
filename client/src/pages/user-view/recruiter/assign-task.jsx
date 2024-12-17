import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useToast } from "@/hooks/use-toast"; // Import useToast hook
import { handleAssignTask } from "@/services/task-services";
import handleLockBalance from "@/services/wallet-services";
import { ConfirmModal } from "@/components/ui/confirm-modal";

const AssignTask = () => {
  const { id } = useParams(); // Lấy applicationId từ params

  const applicationId = id;
  const navigate = useNavigate();
  const { toast } = useToast(); // Use the toast hook inside the component
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    deadline: "",
    paymentAmount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const { title, description, deadline, paymentAmount } = taskData;

    if (!title || !description || !deadline || !paymentAmount) {
      toast({
        title: "Vui lòng điền đầy đủ thông tin để tạo nhiệm vụ!",
        variant: "destructive",
      });
      return;
    }

    

    const task = {
      applicationId,
      title,
      description,
      deadline,
      paymentAmount: parseFloat(paymentAmount),
    };

    try {
      // Try to lock the balance first
      const balanceLocked = await handleLockBalance(paymentAmount);
      if (!balanceLocked) {
        toast({
          title: "Số dư không đủ để tạo nhiệm vụ!",
          variant: "destructive",
        });
        return; // Don't proceed if balance couldn't be locked
      }

      // If balance lock succeeded, create the task
      await handleAssignTask(task, toast);

      // Navigate to the posts page
      navigate("/recruiter/myposts");
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra khi tạo và gán nhiệm vụ!",
        variant: "destructive",
      });
    }

    console.log("Task data:", task);
  };

  return (
    <div className="assign-task page bg-gray-100 min-h-screen p-5 mt-10">
      <div className="container mx-auto bg-white shadow-lg rounded-lg p-6 max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6">
          Giao việc freelance cho {applicationId}
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tiêu đề:</label>
            <input
              type="text"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
              placeholder="Nhập tiêu đề nhiệm vụ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mô tả:</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
              rows="4"
              placeholder="Nhập mô tả nhiệm vụ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Hạn chót:</label>
            <input
              type="date"
              name="deadline"
              value={taskData.deadline}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Số tiền thanh toán:
            </label>
            <input
              type="number"
              name="paymentAmount"
              value={taskData.paymentAmount}
              onChange={handleInputChange}
              className="border rounded w-full px-3 py-2"
              placeholder="Nhập số tiền thanh toán"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            onClick={() => navigate("/recruiter/myposts")}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            Giao việc
          </button>
        </div>

      </div>
      {isModalOpen && (
        <ConfirmModal
          title="Xác nhận"
          content={`Xác nhận khóa ${taskData.paymentAmount.toLocaleString()} VNĐ trong ví để tạo nhiệm vụ này?`}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleSubmit}
        />
      )}
    </div>
  );
};

export default AssignTask;
