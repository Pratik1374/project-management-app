import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import Sidebar from "@/components/Sidebar";
import InputComponent from "@/components/InputCompoent";
import TextareaComponent from "@/components/TextareaComponent";
import { useUser } from "@/utils/auth";
import Card from "@/components/Card";

const NewProject: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user: authUser, isLoading } = useUser();

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

  if (!authUser) {
    router.push("/login");
    return <></>;
  }

  return (
    <div className="flex h-screen flex-1 bg-transparent text-gray-100">
      <Sidebar />
      <main className="mt-[30px] h-full flex-1 overflow-auto p-4 md:p-6 md:mt-0">
        <div className="mx-auto max-w-[600px]">
          <Card title="Create a New Project">
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
          </Card>
        </div>
      </main>
    </div>
  );
};

export default NewProject;
