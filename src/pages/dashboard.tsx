"use client";

import { api } from "@/utils/api";
import Loader from "@/components/Loader";
import Sidebar from "@/components/Sidebar";
import { useUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import Card from "@/components/Card";
import PieChart from "@/components/PieChart";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } =
    api.dashboard.getDashboardStats.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading || statsLoading) {
    return <Loader />;
  }

  if (!user) {
    router.push("/login");
    return <></>;
  }

  const {
    totalProjects,
    totalTasks = 0,
    completedTasks = 0,
    tasksByPriority = 0,
    inProgressTasks = 0,
  } = stats || {};

  const completedTasksPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex h-screen bg-transparent text-gray-100">
      <Sidebar />
      <main className="mt-[30px] h-full flex-1 overflow-auto p-4 md:mt-0 md:p-6">
        <h1 className="mb-4 text-xl font-bold text-white md:text-2xl">
          Welcome, {user.name || user.email}!
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 text-[12px] md:text-[14px]">
          {/* Stats Card */}
          <Card title="Overall Stats">
            <div className="flex flex-col gap-4">
              <StatItem label="Total Projects" value={totalProjects || 0} />
              <StatItem label="Total Tasks" value={totalTasks || 0} />
              <div>
                <p className="text-gray-400">Completed Tasks</p>
                <div className="h-2.5 w-full rounded-full bg-gray-700 mt-2">
                  <div
                    className="h-2.5 rounded-full bg-green-500"
                    style={{ width: `${completedTasksPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-300 mt-1">
                  {completedTasksPercentage}% complete
                </p>
              </div>
            </div>
          </Card>

          {/* Task Priority Chart */}
          <Card title="Tasks by Priority">
            {totalTasks > 0 ? (
              <PieChart
                data={Object.entries(tasksByPriority).map(([label, value]) => ({
                  label,
                  value,
                  color:
                    label === "High"
                      ? "#ef4444" // Red
                      : label === "Medium"
                        ? "#eab308" // Yellow
                        : "#22c55e", // Green
                }))}
              />
            ) : (
              <p className="text-center text-gray-400">No tasks yet.</p>
            )}
          </Card>

          {/* Tasks by Status Chart */}
          <Card title="Tasks by Status">
            {totalTasks > 0 ? (
              <PieChart
                data={[
                  {
                    label: "ToDo",
                    value: totalTasks - completedTasks - inProgressTasks,
                    color: "#a855f7",
                  },
                  {
                    label: "InProgress",
                    value: inProgressTasks,
                    color: "#3b82f6", // Blue
                  },
                  {
                    label: "Completed",
                    value: completedTasks,
                    color: "#22c55e", // Green
                  },
                ]}
              />
            ) : (
              <p className="text-center text-gray-400">No tasks yet.</p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

const StatItem: React.FC<{ label: string; value: number }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-gray-100">{value}</p>
  </div>
);
