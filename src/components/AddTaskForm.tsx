import { api } from "@/utils/api";
import { useState } from "react";
import InputComponent from "./InputCompoent";
import Dropdown from "./Dropdown";
import { toast } from "react-toastify";
import TextareaComponent from "./TextareaComponent";

interface AddTaskFormProps {
  projectId: string;
  onTaskAdded: () => void;
  onClose: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  projectId,
  onTaskAdded,
  onClose,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [assignedTo, setAssignedTo] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const { data: members } = api.project.getProjectMembers.useQuery(
    { projectId: projectId },
    {
      enabled: !!projectId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  const { mutate: createTask, isPending: isCreating } =
    api.task.createTask.useMutation({
      onSuccess: () => {
        onTaskAdded();
        onClose();
        toast.success("Task added successfully!");
      },
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createTask({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      projectId,
      assignedToId: assignedTo,
      priority,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputComponent
        id="title"
        type="text"
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextareaComponent
        id="description"
        label="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional"
      />
      <InputComponent
        id="dueDate"
        type="date"
        label="Due Date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
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
          value={assignedTo || ""}
          onChange={(value) => setAssignedTo(value)}
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
          value={priority}
          onChange={(value) => setPriority(value as "High" | "Medium" | "Low")}
        />
      </div>
      <button
        type="submit"
        disabled={isCreating}
        className={`submit-button ${isCreating ? "submitting" : ""} `}
      >
        {isCreating ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
};

export default AddTaskForm;
