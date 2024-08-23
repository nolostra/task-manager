import React from "react";

const Modal = ({ isOpen, onClose, task }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className=" bg-gray-900 bg-opacity-95 flex justify-center items-center w-full ">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full flex flex-col">
        <h2 className="text-xl font-bold mb-4">Task Details</h2>
        <div className="flex-grow">
          <p>
            <strong>Title:</strong> {task.title || "N/A"}
          </p>
          <p>
            <strong>Description:</strong> {task.description || "N/A"}
          </p>
          <p>
            <strong>Created At:</strong> {formatDate(task.createdAt)}
          </p>
        </div>
        <div className="flex flex-row justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
