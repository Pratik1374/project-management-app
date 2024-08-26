"use client";

import { useEffect, useState } from "react";

import { type Task } from "@prisma/client";
import Dropdown from "@/components/Dropdown";
import Sidebar from "@/components/Sidebar";
import { api } from "@/utils/api";
import { useUser } from "@/utils/auth";
import Loader from "@/components/Loader";
import Card from "@/components/Card";
import { useRouter } from "next/router";

type TaskPriority = "High" | "Medium" | "Low";
type TaskStatus = "ToDo" | "InProgress" | "Completed";

const MyTasks: React.FC = () => {
  const { data: tasks = [], isPending: isLoading } =
    api.task.getMyTasks.useQuery();
  const utils = api.useUtils();
  const [taskStatuses, setTaskStatuses] = useState<
    Record<string, Task["status"]>
  >({});
  const { mutate, isPending: isUpdatingTasks } =
    api.task.updateTaskStatus.useMutation();
  const userId = useUser()?.user?.id;
  const router = useRouter();

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortedTasks, setSortedTasks] = useState<Task[]>(tasks || []);

  const handleEditClick = (taskId: string) => {
    setEditingTaskId(taskId);
  };

  const handleDropdownChange = (newStatus: Task["status"]) => {
    if (editingTaskId) {
      handleStatusChange(editingTaskId, newStatus);
      setEditingTaskId(null);
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: Task["status"],
  ) => {
    setTaskStatuses((prevStatuses) => ({
      ...prevStatuses,
      [taskId]: newStatus,
    }));

    try {
      await mutate({
        taskId,
        status: newStatus as "ToDo" | "InProgress" | "Completed",
      });
      utils.task.getMyTasks.invalidate();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  useEffect(() => {
    const sortTasks = () => {
      const sorted = [...(tasks || [])].sort((a, b) => {
        let comparison = 0;

        if (sortBy === "priority") {
          const priorityOrder: Record<TaskPriority | "Low", number> = {
            High: 3,
            Medium: 2,
            Low: 1,
          };
          comparison =
            (priorityOrder[(a.priority as TaskPriority) || "Low"] || 0) -
            (priorityOrder[(b.priority as TaskPriority) || "Low"] || 0);
        } else if (sortBy === "status") {
          comparison = a.status.localeCompare(b.status);
        } else if (sortBy === "dueDate") {
          comparison =
            (a.dueDate ? a.dueDate.getTime() : 0) -
            (b.dueDate ? b.dueDate.getTime() : 0);
        } else if (sortBy === "createdAt") {
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
        }

        return sortOrder === "asc" ? comparison : -comparison;
      });

      setSortedTasks(sorted);
    };

    sortTasks();
  }, [tasks, sortBy, sortOrder]);

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!userId) {
    router.push("/login");
    return <></>;
  }

  return (
    <div className="flex h-screen bg-transparent text-gray-100">
      <Sidebar />
      {isUpdatingTasks && <Loader />}
      <main className="mt-[30px] h-full flex-1 overflow-auto p-4 md:mt-0 md:p-6">
        <Card>
          <div className="flex w-full items-center justify-start gap-2">
            <h2 className="card-title">Tasks</h2>
            <div className="flex flex-1 items-center justify-center gap-2">
              <div className="w-[150px]">
                <Dropdown
                  label=""
                  value={sortBy}
                  onChange={handleSortChange}
                  options={[
                    { value: "priority", label: "Priority" },
                    { value: "status", label: "Status" },
                    { value: "dueDate", label: "Due Date" },
                    { value: "createdAt", label: "Created At" },
                  ]}
                />
              </div>
              <button
                onClick={handleSortOrderChange}
                className="flex items-center justify-center"
              >
                <p>{sortOrder === "asc" ? "▲" : "▼"}</p>
                <p className="text-[8px] text-gray-400 md:text-[10px]">
                  Toggle Order
                </p>
              </button>
            </div>
          </div>
          {sortedTasks?.length == 0 ? (
            <p className="mt-2 w-full text-center text-[12px] text-gray-400 md:text-[14px]">
              No any tasks assigned for you.
            </p>
          ) : (
            <ul className="my-4 list-disc gap-[10px]">
              {sortedTasks?.map((task) => (
                <li key={task.id} className="w-full space-y-1">
                  <Card key={`task_${task.id}`} shadow={false} border>
                    <div className="flex w-full items-start justify-between">
                      <div className="flex w-full flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-[13px] font-bold md:text-[15px]">
                            {task.title}
                          </h3>
                        </div>
                        <div className="flex w-full flex-col gap-[2px]">
                          <p className="text-[12px] text-gray-300 md:text-[14px]">
                            Description:{" "}
                          </p>
                          <p className="w-full overflow-y-hidden overflow-x-clip rounded-md bg-gray-900 p-2 text-[12px] md:text-[14px]">
                            {task.description || "No description"}
                          </p>
                        </div>
                        {task.priority && (
                          <div className="flex items-center gap-1 text-[12px] md:text-[14px]">
                            <p>Priority:</p>
                            <span
                              className={`rounded-md px-2 py-1 font-semibold text-white ${
                                task.priority === "High"
                                  ? "bg-red-500"
                                  : task.priority === "Medium"
                                    ? "bg-yellow-400"
                                    : "bg-violet-400"
                              }`}
                            >
                              {task.priority}
                            </span>
                          </div>
                        )}
                        {task.status && (
                          <div className="flex w-full items-center gap-1 text-[12px] md:text-[14px]">
                            <p>Status:</p>
                            {editingTaskId === task.id ? (
                              <div className="flex w-full max-w-[150px] items-center">
                                <Dropdown
                                  label=""
                                  value={taskStatuses[task.id] || task.status}
                                  onChange={handleDropdownChange}
                                  options={[
                                    { value: "ToDo", label: "ToDo" },
                                    {
                                      value: "InProgress",
                                      label: "InProgress",
                                    },
                                    { value: "Completed", label: "Completed" },
                                  ]}
                                />
                                <button
                                  onClick={() => setEditingTaskId(null)}
                                  className="ml-2"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="h-4 w-4 text-gray-400 hover:text-gray-100"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <>
                                <span
                                  className={`rounded-md px-2 py-1 font-semibold text-white ${
                                    task.status === "ToDo"
                                      ? "bg-gray-400"
                                      : task.status === "InProgress"
                                        ? "bg-blue-500"
                                        : "bg-green-500"
                                  }`}
                                >
                                  {taskStatuses[task.id] || task.status}
                                </span>
                                <button
                                  onClick={() => handleEditClick(task.id)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="ml-2 h-4 w-4 text-gray-400 hover:text-gray-100"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.813-1.621a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125m-1.687 1.688l-1.687 1.688"
                                    />
                                  </svg>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                        <p className="w-full text-right text-[10px] text-gray-400 md:text-[12px]">
                          {task.dueDate ? (
                            <>
                              <span
                                className={`${
                                  new Date(task.dueDate).getTime() <
                                    new Date().setHours(0, 0, 0, 0) &&
                                  "line-through"
                                }`}
                              >
                                Due Date:{" "}
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                              <>
                                {new Date(task.dueDate).getTime() <
                                new Date().setHours(0, 0, 0, 0) ? (
                                  <span className="ml-1 text-red-500">Due</span>
                                ) : (
                                  <></>
                                )}
                              </>
                            </>
                          ) : (
                            "Due Date: Not set"
                          )}
                        </p>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </main>
    </div>
  );
};

export default MyTasks;
