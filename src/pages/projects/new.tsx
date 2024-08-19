import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

const NewProject: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const createProjectMutation = api.project.createProject.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
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
    } catch (err) {
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-6 text-2xl font-bold">Create a New Project</h2>
      <form onSubmit={handleSubmit} className="space-y-4 text-black">
        <div>
          <label htmlFor="name" className="mb-2 block font-semibold">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="mb-2 block font-semibold">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>

        <button
          type="submit"
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          disabled={createProjectMutation.isPending}
        >
          {createProjectMutation.isPending ? "Creating..." : "Create Project"}
        </button>
      </form>
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default NewProject;
