import Sidebar from "@/components/Sidebar";
import { useUser } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push("/login")
    return (
      <></>
    );
  }

  return (
    <div className="flex">
      <Sidebar/>
      <h1>Welcome to the Dashboard, {user.email}!</h1>
    </div>
  );
}
