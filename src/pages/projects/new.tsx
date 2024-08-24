import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Sidebar from "@/components/Sidebar";
import InputComponent from "@/components/InputCompoent";
import TextareaComponent from "@/components/TextareaComponent";

const NewProject: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createProjectMutation = api.project.createProject.useMutation({
    onSuccess: (data) => {
      router.push(`/projects/${data.id}`);
    },
    onError: (error) => {
      setError(error.message || "Failed to create project. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await createProjectMutation.mutateAsync({
        name,
        description,
      });
    } catch (err) {}
  };

  return (
    <div className="flex h-screen flex-1 bg-black text-gray-100">
      <Sidebar />
      <main className="mt-5 h-full flex-1 overflow-auto p-6 md:mt-0">
        <div className="mx-auto max-w-[600px]">
          <h2 className="mb-6 w-fit text-2xl font-bold">
            Create a New Project
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <InputComponent
              label="Project Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <TextareaComponent
              label="Description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button
              type="submit"
              className="submit-button"
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending
                ? "Creating..."
                : "Create Project"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewProject;
