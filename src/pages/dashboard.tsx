"use client";
import { useUser } from "@/utils/auth";
import { signOut } from "next-auth/react";

export default function DashboardPage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div>
        <p>Please log in to view the dashboard.</p>
        {/* Link to your login page */}
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome to the Dashboard, {user.name || user.email}!</h1>
      {/* ... your protected dashboard content ... */}
      <button onClick={() => signOut()}>Log Out</button>
    </div>
  );
}
