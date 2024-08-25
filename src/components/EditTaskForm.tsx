"use client"
import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import Dropdown from "./Dropdown";
import InputComponent from "./InputCompoent";
import { toast } from "react-toastify";
import TextareaComponent from "./TextareaComponent";

type TaskPriority = "High" | "Medium" | "Low";

interface EditTaskFormProps {
  taskId: string;
  onClose: () => void;
  onTaskUpdate: Function;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  taskId,
  onClose,
  onTaskUpdate,
}) => {
  const {
    data: initialTask,
    isPending,
    refetch: refetchTask
  } = api.task.getTaskById.useQuery(
    { taskId },
    {
      enabled: !!taskId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  );

  const [editedTaskTitle, setEditedTaskTitle] = useState(
    initialTask?.title || "",
  );
  const [editedTaskDescription, setEditedTaskDescription] = useState(
    initialTask?.description || "",
  );
  const [editedTaskDueDate, setEditedTaskDueDate] = useState<
    string | undefined
  >(
    initialTask?.dueDate
      ? initialTask.dueDate.toISOString().slice(0, 10)
      : undefined,
  );
  const [editedTaskAssignedTo, setEditedTaskAssignedTo] = useState<
    string | undefined
  >(initialTask?.assignedToId || undefined);
  const [editedTaskPriority, setEditedTaskPriority] = useState<TaskPriority>(
    (initialTask?.priority as TaskPriority) || "Medium",
  );

  const { mutate: updateTask, isPending: isUpdatingTask } =
    api.task.updateTask.useMutation({
      onSuccess: () => {
        refetchTask()
        onClose();
        onTaskUpdate();
        toast.success("Task updated successfully!");
      },
    });

  const handleSaveTask = () => {
    updateTask({
      taskId: taskId,
      title: editedTaskTitle,
      description: editedTaskDescription,
      dueDate: editedTaskDueDate ? new Date(editedTaskDueDate) : undefined,
      assignedToId: editedTaskAssignedTo,
      priority: editedTaskPriority,
    });
  };

  const { data: members } = api.project.getProjectMembers.useQuery(
    { projectId: initialTask?.projectId || "" },
    {
      enabled: !!initialTask?.projectId,
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (initialTask) {
      setEditedTaskTitle(initialTask.title || "");
      setEditedTaskDescription(initialTask.description || "");
      setEditedTaskDueDate(initialTask.dueDate ? initialTask.dueDate.toISOString().slice(0, 10) : undefined);
      setEditedTaskAssignedTo(initialTask.assignedToId || "");
      setEditedTaskPriority(initialTask.priority as TaskPriority);
    }
  }, [initialTask]); 

  if (isPending) {
    return <div>Loading task...</div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSaveTask();
      }}
      className="space-y-4"
    >
      <InputComponent
        id="editTaskTitle"
        type="text"
        label="Task Title"
        value={editedTaskTitle}
        onChange={(e) => setEditedTaskTitle(e.target.value)}
        required
      />

      <TextareaComponent
        id="editTaskDescription"
        label="Task Description"
        value={editedTaskDescription}
        onChange={(e) => setEditedTaskDescription(e.target.value)}
        placeholder="Optional"
      />

      <InputComponent
        id="editTaskDueDate"
        type="date"
        label="Due Date"
        value={editedTaskDueDate}
        onChange={(e) => setEditedTaskDueDate(e.target.value)}
      />

      <Dropdown
        label="Assign To"
        options={[
          { value: "", label: "Unassigned" },
          ...(members || []).map((member) => ({
            value: member.id,
            label: `${member.name} (${member.email})`,
          })),
        ]}
        value={editedTaskAssignedTo || ""}
        onChange={(value) => setEditedTaskAssignedTo(value)}
      />

      <Dropdown
        label="Priority"
        options={[
          { value: "High", label: "High" },
          { value: "Medium", label: "Medium" },
          { value: "Low", label: "Low" },
        ]}
        value={editedTaskPriority}
        onChange={(value) => setEditedTaskPriority(value as TaskPriority)}
      />

      <button
        type="submit"
        disabled={isUpdatingTask}
        className={`submit-button ${isUpdatingTask ? "submitting" : ""} `}
      >
        {isUpdatingTask ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default EditTaskForm;
