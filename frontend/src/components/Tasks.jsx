import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Draggable, Droppable } from "react-drag-and-drop";
import useFetch from "../hooks/useFetch";
import Loader from "./utils/Loader";
import Tooltip from "./utils/Tooltip";

const Tasks = () => {
  const authState = useSelector((state) => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = useCallback(() => {
    const config = {
      url: "/tasks",
      method: "get",
      headers: { Authorization: authState.token },
    };
    fetchData(config, { showSuccessToast: false }).then((data) =>
      setTasks(data.tasks)
    );
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = {
      url: `/tasks/${id}`,
      method: "delete",
      headers: { Authorization: authState.token },
    };
    fetchData(config).then(() => fetchTasks());
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const onDrop = (data, status) => {
    const taskId = data.task;
    const task = tasks.find((task) => task._id === taskId);

    if (!task) {
      console.error(`Unable to find task with id: ${taskId}`);
      return;
    }

    const updatedTask = { ...task, status };

    const config = {
      url: `/tasks/${task._id}`,
      method: "put",
      data: { status },
      headers: { Authorization: authState.token },
    };
    fetchData(config).then(() => fetchTasks());
  };

  const getTasksByStatus = (status) =>
    tasks.filter((task) => task.status === status);

  const renderTask = (task, index) => (
    <Draggable key={task._id} type="task" data={task._id}>
      <div className="bg-[#bfdbfe] my-4 p-4 text-gray-600 rounded shadow-md">
        <div className="flex">
          <span className="font-medium">
            Task {task.title ? `- ${task.title}` : ""}
          </span>
        </div>
        <div className="whitespace-pre">{task.description}</div>
        <div className="whitespace-pre">{formatDate(task.createdAt)}</div>
        <div className="flex justify-end">
          <Link
            to={`/tasks/${task._id}`}
            className="ml-auto text-white cursor-pointer bg-[#3b82f6] p-1 rounded-md"
          >
            Edit
          </Link>
          <span
            className="mx-2 text-white cursor-pointer bg-[#f87171] p-1 rounded-md"
            onClick={() => handleDelete(task._id)}
          >
            Delete
          </span>
          <button
            className="ml-2 text-white cursor-pointer bg-[#1d4ed8] p-1 rounded-md"
            onClick={() => {
              setSelectedTask(task);
              setIsModalOpen(true);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </Draggable>
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <>
      <div className="my-2 mx-auto py-4 px-2">
        <div className="mb-4">
          <Link
            to="/tasks/add"
            className="block bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2 text-center"
          >
            <i className="fa-solid fa-plus"></i> Add task
          </Link>
        </div>

        {tasks.length !== 0 && (
          <h2 className="my-2 ml-2 md:ml-0 text-xl">
            Your tasks ({tasks.length})
          </h2>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
            {["todo", "in_progress", "done"].map((status) => (
              <Droppable
                key={status}
                types={["task"]}
                onDrop={(data) => onDrop(data, status)}
              >
                <div className="bg-white p-4 rounded-md shadow-md min-h-[300px]">
                  <h3 className="bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-800 rounded uppercase">
                    {status.replace("_", " ")}
                  </h3>
                  {getTasksByStatus(status).map(renderTask)}
                </div>
              </Droppable>
            ))}
          </div>
        )}
      </div>

      {/* Modal for viewing task details */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{selectedTask.title}</h2>
            <p className="mb-4"><strong>Description:</strong> {selectedTask.description}</p>
            <p className="mb-4"><strong>Status:</strong> {selectedTask.status}</p>
            <p className="mb-4"><strong>Created At:</strong> {formatDate(selectedTask.createdAt)}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Tasks;
