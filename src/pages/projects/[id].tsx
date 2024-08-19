import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import InputComponent from "@/components/InputCompoent";

const ProjectDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // Fetch project details
  const { data: project, isLoading: isProjectLoading } =
    api.project.getProjectById.useQuery(
      { projectId: id as string },
      { enabled: !!id }, // Only run the query if id exists
    );

  // Fetch tasks associated with the project
  const { data: tasks, isLoading: isTasksLoading } =
    api.task.getTasksByProject.useQuery(
      { projectId: id as string },
      { enabled: !!id }, // Only run the query if id exists
    );

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<string | undefined>(
    undefined,
  );
  const { mutate: addTask, isPending } = api.task.createTask.useMutation();

  const handleAddTask = () => {
    if (id) {
      addTask({
        title: newTaskTitle,
        description: newTaskDescription,
        dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
        projectId: id as string,
      });
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDueDate("");
    }
  };

  if (isProjectLoading || isTasksLoading) {
    return <div className="text-gray-100">Loading...</div>;
  }

  if (!project) {
    return <div className="text-gray-100">Project not found</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 h-full overflow-auto">
        <h1 className="mb-4 text-3xl font-bold">{project.name}</h1>
        <p className="mb-2">
          Description: {project.description || "No description"}
        </p>
        <p className="mb-4">Created at: {project.createdAt.toString()}</p>
        <p className="mb-4">Updated at: {project.updatedAt.toString()}</p>

        <h2 className="mb-4 text-2xl font-semibold">Tasks</h2>
        <ul className="mb-6 list-disc pl-5">
          {tasks?.map((task) => (
            <li key={task.id} className="mb-2">
              <h3 className="text-xl font-medium">{task.title}</h3>
              <p>{task.description || "No description"}</p>
              <p>
                Due Date:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "Not set"}
              </p>
            </li>
          ))}
        </ul>

        <h2 className="mb-4 text-2xl font-semibold">Add New Task</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTask();
          }}
          className="space-y-4"
        >
          <InputComponent
            id="title"
            type="text"
            label="Task Title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required
          />
          <InputComponent
            id="description"
            type="text"
            label="Task Description"
            value={newTaskDescription}
            onChange={(e) => setNewTaskDescription(e.target.value)}
            placeholder="Optional"
          />
          <InputComponent
            id="dueDate"
            type="date"
            label="Due Date"
            value={newTaskDueDate}
            onChange={(e) => setNewTaskDueDate(e.target.value)}
          />
          <button
            type="submit"
            disabled={isPending}
            className={`mt-4 w-full rounded p-2 ${
              isPending ? "bg-gray-600" : "bg-blue-600"
            } text-gray-100`}
          >
            {isPending ? "Adding..." : "Add Task"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ProjectDetails;
