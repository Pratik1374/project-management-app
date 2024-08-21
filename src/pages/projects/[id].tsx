import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import InputComponent from "@/components/InputCompoent";
import Dropdown from "@/components/Dropdown";
import { useUser } from "@/utils/auth";
import Card from "@/components/Card";
import Modal from "@/components/Modal";
import EditTaskForm from "@/components/EditTaskForm";

type TaskPriority = "High" | "Medium" | "Low";
type TaskStatus = "ToDo" | "InProgress" | "Completed";

const ProjectDetails: React.FC = () => {
  const router = useRouter();
  const { user: authUser, isLoading } = useUser();
  const { id: projectId } = router.query;
  const { data: project, isLoading: isProjectLoading } =
    api.project.getProjectById.useQuery(
      { projectId: projectId as string },
      {
        enabled: !!projectId,
        refetchOnWindowFocus: false,
        retry: false,
      },
    );
  const {
    data: tasks,
    isLoading: isTasksLoading,
    refetch: refetchTasks,
  } = api.task.getTasksByProject.useQuery(
    { projectId: projectId as string },
    {
      enabled: !!projectId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
  const {
    data: members,
    isLoading: isMembersLoading,
    refetch: refetchMembers,
  } = api.project.getProjectMembers.useQuery(
    { projectId: projectId as string },
    {
      enabled: !!projectId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<string | undefined>(
    undefined,
  );
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState<
    string | undefined
  >(undefined);

  const [newTaskPriority, setNewTaskPriority] =
    useState<TaskPriority>("Medium");

  const { mutate: addTask, isPending: isAddingTask } =
    api.task.createTask.useMutation({
      onSuccess: () => {
        setNewTaskTitle("");
        setNewTaskDescription("");
        setNewTaskDueDate(undefined);
        setNewTaskAssignedTo(undefined);
        setNewTaskPriority("Medium");
        refetchTasks();
        alert("Task added successfully!");
      },
    });

  const handleAddTask = () => {
    if (projectId) {
      addTask({
        title: newTaskTitle,
        description: newTaskDescription,
        dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
        projectId: projectId as string,
        assignedToId: newTaskAssignedTo,
        priority: newTaskPriority,
      });

      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDueDate(undefined);
      setNewTaskAssignedTo(undefined);
      setNewTaskPriority("Medium");

      refetchTasks();
    }
  };

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const { data: user, isLoading: isUserLoading } =
    api.user.getUserByEmail.useQuery(
      { email: newMemberEmail },
      {
        enabled: !!newMemberEmail,
        refetchOnWindowFocus: false,
        retry: false,
      },
    );
  const { mutate: addMember, isPending: isAddingMember } =
    api.project.addMember.useMutation({
      onSuccess: () => {
        setNewMemberEmail("");
        setNewMemberRole("");
        refetchMembers();
        alert("Member added successfully!");
      },
    });
  const handleAddMember = async () => {
    if (projectId && user) {
      try {
        await addMember({
          projectId: projectId as string,
          userId: user.id,
          role: newMemberRole || "Member",
        });
      } catch (error) {
        console.error("Error adding member:", error);
        alert("Error adding member. Please try again.");
      }
    }
  };

  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleEditTask = (taskId: string) => {
    setEditingTaskId(taskId);
    setIsEditingTask(true);
  };

  const handleCloseModal = () => {
    setIsEditingTask(false);
    setEditingTaskId(null);
  };

  if (isProjectLoading || isTasksLoading || isMembersLoading) {
    return <div className="text-gray-100">Loading...</div>;
  }

  if (!project) {
    return <div className="text-gray-100">Project not found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!authUser) {
    router.push("/login");
    return <></>;
  }
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <main className="h-full flex-1 overflow-auto p-6">
        {/* Project Details Card */}
        <Card title={project.name}>
          <p className="mb-2">
            Description: {project.description || "No description"}
          </p>
          <p className="mb-4">
            Created at:{" "}
            {project.createdAt.toLocaleDateString() +
              " " +
              project.createdAt.toLocaleTimeString()}
          </p>
          <p className="mb-4">
            Updated at:{" "}
            {project.updatedAt.toLocaleDateString() +
              " " +
              project.updatedAt.toLocaleTimeString()}
          </p>
        </Card>

        {/* Project Members Card */}
        <Card title="Project Members">
          <ul className="mb-6 list-disc pl-5">
            {members?.map((member) => (
              <li key={member.id} className="mb-2">
                <p className="text-lg font-medium">
                  {member.name} ({member.email}) - {member.role}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        {/* Tasks Card */}
        <Card title="Tasks">
          <ul className="mb-6 list-disc pl-5">
            {tasks?.map((task) => (
              <Card key={`task_${task.id}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <li key={task.id} className="mb-2">
                      <h3 className="text-xl font-medium">{task.title}</h3>
                      <p>{task.description || "No description"}</p>
                      <p>
                        Due Date:{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "Not set"}
                      </p>
                      {/* Display assigned user */}
                      {task.assignedToId && (
                        <p>
                          Assigned to:{" "}
                          {
                            /* Find user's name from members and display it */
                            members?.find(
                              (member) => member.id === task.assignedToId,
                            )?.name || "Unknown User"
                          }
                        </p>
                      )}
                      {task.priority && (
                        <p>
                          Priority:{" "}
                          <span className="font-semibold">{task.priority}</span>
                        </p>
                      )}
                      {task.status && (
                        <p>
                          Status:{" "}
                          <span className="font-semibold">{task.status}</span>
                        </p>
                      )}
                    </li>
                  </div>
                  <button className="inline-flex px-4 py-2 bg-gray-500 rounded-md" onClick={() => handleEditTask(task.id)}>Edit</button>
                </div>
              </Card>
            ))}
          </ul>
        </Card>

        {/* Add New Task Card */}
        <Card title="Add New Task">
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
            <div>
              <Dropdown
                label="Assign To"
                options={[
                  { value: "", label: "Unassigned" },
                  ...(members || []).map((member) => ({
                    value: member.id,
                    label: `${member.name} (${member.email})`,
                  })),
                ]}
                value={newTaskAssignedTo || ""}
                onChange={(value) => setNewTaskAssignedTo(value)}
              />
            </div>
            <div>
              <Dropdown
                label="Priority"
                options={[
                  { value: "High", label: "High" },
                  { value: "Medium", label: "Medium" },
                  { value: "Low", label: "Low" },
                ]}
                value={newTaskPriority}
                onChange={(value) => setNewTaskPriority(value as TaskPriority)}
              />
            </div>
            <button
              type="submit"
              disabled={isAddingTask}
              className={`mt-4 w-full rounded p-2 ${
                isAddingTask ? "bg-gray-600" : "bg-blue-600"
              } text-gray-100`}
            >
              {isAddingTask ? "Adding..." : "Add Task"}
            </button>
          </form>
        </Card>
        <Card title="Add New Member">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddMember();
            }}
            className="space-y-4"
          >
            <InputComponent
              id="email"
              type="email"
              label="Member Email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              required
            />
            <InputComponent
              id="role"
              type="text"
              label="Member Role"
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              placeholder="Optional (default is Member)"
            />
            <button
              type="submit"
              disabled={isAddingMember || isUserLoading}
              className={`mt-4 w-full rounded p-2 ${isAddingMember || isUserLoading ? "bg-gray-600" : "bg-green-600"} text-gray-100`}
            >
              {isAddingMember
                ? "Adding..."
                : isUserLoading
                  ? "Fetching user..."
                  : "Add Member"}
            </button>
          </form>
        </Card>
        <Modal isOpen={isEditingTask} onClose={handleCloseModal}>
          {editingTaskId && (
            <EditTaskForm
              taskId={editingTaskId}
              onTaskUpdate={refetchTasks}
              onClose={handleCloseModal}
            />
          )}
        </Modal>
      </main>
    </div>
  );
};

export default ProjectDetails;
