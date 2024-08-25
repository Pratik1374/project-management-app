"use client"
import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import InputComponent from "./InputCompoent";
import Loader from "./Loader";
import { toast } from "react-toastify";
import TextareaComponent from "./TextareaComponent";

interface EditProjectFormProps {
  projectId: string;
  onProjectUpdate: () => void;
}

const EditProjectForm: React.FC<EditProjectFormProps> = ({
  projectId,
  onProjectUpdate,
}) => {
  const {
    data: initialProject,
    isPending,
  } = api.project.getProjectById.useQuery(
    { projectId },
    {
      enabled: !!projectId,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
    },
  );

  const [name, setName] = useState(initialProject?.name || "");
  const [description, setDescription] = useState(
    initialProject?.description || "",
  );

  const { mutate: updateProject, isPending: isUpdating } =
    api.project.updateProject.useMutation({
      onSuccess: () => {
        onProjectUpdate();
        toast.success("Project updated successfully!");
      },
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProject({
        projectId,
        name,
        description,
      });
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Error updating project. Please try again.");
    }
  };

  useEffect(() => {
    if (initialProject) {
      setName(initialProject.name || "");
      setDescription(initialProject.description || "");
    }
  }, [initialProject]);

  return (
    <>
    {isPending && <Loader/>}
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputComponent
        id="name"
        type="text"
        label="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextareaComponent
        id="description"
        label="Project Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        type="submit"
        disabled={isUpdating}
        className={`submit-button ${isUpdating ? "submitting" : ""} `}
      >
        {isUpdating ? "Updating..." : "Update Project"}
      </button>
    </form>
    </>
  );
};

export default EditProjectForm;
