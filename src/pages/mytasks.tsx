"use client";

import { useState } from "react";

import { type Task } from "@prisma/client";
import Dropdown from "@/components/Dropdown";
import Sidebar from "@/components/Sidebar";
import { api } from "@/utils/api";
import { useUser } from "@/utils/auth";

const MyTasks: React.FC = () => {
  const { data: tasks, isLoading } = api.task.getMyTasks.useQuery();
  const utils = api.useContext();
  const [taskStatuses, setTaskStatuses] = useState<
    Record<string, Task["status"]>
  >({});
  const { mutate } = api.task.updateTaskStatus.useMutation();
  const userId = useUser()?.user?.id;

  if (isLoading) {
    return <div className="text-gray-100">Loading tasks...</div>;
  }

  if (!userId) {
    return (
      <div className="text-gray-100">
        You must be logged in to view your tasks.
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <div className="text-gray-100">No tasks assigned to you.</div>;
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.project.ownerId === userId && b.project.ownerId !== userId) {
      return -1;
    } else if (a.project.ownerId !== userId && b.project.ownerId === userId) {
      return 1;
    } else {
      return a.project.name.localeCompare(b.project.name);
    }
  });

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

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="h-full flex-1 overflow-auto p-6">
        <h1 className="mb-6 text-3xl font-bold">My Tasks</h1>
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className="mb-4 rounded-md bg-gray-800 p-4 shadow-md"
          >
            <h2 className="text-xl font-semibold text-gray-200">
              {task.project.name}
            </h2>
            <div className="mt-2 flex items-center justify-between">
              <h3 className="text-lg font-medium">{task.title}</h3>
              <Dropdown
                label="Status"
                options={[
                  { value: "ToDo", label: "To Do" },
                  { value: "InProgress", label: "In Progress" },
                  { value: "Completed", label: "Completed" },
                ]}
                value={taskStatuses[task.id] || task.status}
                onChange={(newStatus) =>
                  handleStatusChange(task.id, newStatus as Task["status"])
                }
              />
            </div>
            <p className="mt-2 text-gray-300">
              {task.description || "No description"}
            </p>
            {task.priority && (
              <p>
                Priority: <span className="font-semibold">{task.priority}</span>
              </p>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default MyTasks;
