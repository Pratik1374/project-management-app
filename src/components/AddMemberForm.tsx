import { api } from "@/utils/api";
import { useState } from "react";
import InputComponent from "./InputCompoent";
import { toast } from "react-toastify";

interface AddMemberFormProps {
  projectId: string;
  onMemberAdded: () => void;
  onClose: () => void;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({
  projectId,
  onMemberAdded,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const { data: user, isLoading: isUserLoading } =
    api.user.getUserByEmail.useQuery(
      { email: email },
      {
        enabled: !!email,
        refetchOnWindowFocus: false,
        retry: false,
      },
    );

  const { mutate: addMember, isPending: isAdding } =
    api.project.addMember.useMutation({
      onSuccess: () => {
        onMemberAdded();
        onClose();
        toast.success("Member added successfully!");
      },
      onError: (error) => {
        if (error.message.includes("already a member")) {
          toast.error("User is already a member of this project.");
        } else {
          toast.error("An error occurred while adding the member.");
        }
      },
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      try {
        await addMember({
          projectId,
          userId: user.id,
          role,
        });
      } catch (error) {
        console.error("Error adding member:", error);
        toast.error("Error adding member. Please try again.");
      }
    } else {
      toast.error("User not found!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputComponent
        id="email"
        type="email"
        label="Member Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputComponent
        id="role"
        type="text"
        label="Member Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Optional (default is Member)"
      />
      <button
        type="submit"
        disabled={isAdding || isUserLoading}
        className={`submit-button ${
          isAdding || isUserLoading ? "submitting" : ""
        } `}
      >
        {isAdding
          ? "Adding..."
          : isUserLoading
            ? "Fetching user..."
            : "Add Member"}
      </button>
    </form>
  );
};

export default AddMemberForm;
