import { X } from "lucide-react";
import React from "react";

const handleConfirmClick = async (onClose, onConfirm) => {
  onConfirm();
  onClose();
};

const ConfirmModal = ({ title, content, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-96">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 rounded-t-lg bg-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title || "Confirm Action"}</h3>
          <X className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 hover:bg-gray-300" onClick={onClose}/>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          <span className="text-gray-600">{content || "Are you sure you want to proceed?"}</span>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-3 px-4 py-3 border-t border-gray-300">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => handleConfirmClick(onClose, onConfirm)}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export { ConfirmModal };
