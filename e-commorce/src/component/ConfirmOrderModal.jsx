import React from "react";

const ConfirmOrderModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px] text-center">
        <h2 className="text-xl font-bold mb-4">Confirm Order</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to place this order?
        </p>

        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="bg-black text-white px-5 py-2 rounded-full"
          >
            Yes, Order
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-5 py-2 rounded-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderModal;
