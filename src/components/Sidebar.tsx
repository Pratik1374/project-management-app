"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import { useUser } from "@/utils/auth";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const sidebarRef = useRef<HTMLElement>(null);
  const { data: projects, refetch } = api.project.getProjects.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      retry: false,
    },
  );
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const closeSidebar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        closeSidebar();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const { mutate: deleteProject, isPending: isDeleting } =
    api.project.deleteProject.useMutation({
      onSuccess: () => {
        refetch();
        router.push("/dashboard");
        toast.success("Project deleted successfully!");
      },
      onError: (error) => {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project. Please try again later.");
      },
    });

  const handleDeleteProject = async (projectId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    ) {
      try {
        await deleteProject({ projectId });
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <>
      <div className="absolute left-2 top-2 z-50 h-fit w-fit bg-transparent md:hidden">
        <button onClick={() => setIsOpen(true)} className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="md:w-64">
        <aside
          ref={sidebarRef}
          className={`fixed left-0 top-0 z-40 h-screen transform border-0 border-r border-solid border-gray-400 bg-black text-[12px] text-white transition-transform duration-300 ease-in-out md:relative md:text-[14px] ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        >
          <div className="p-4 pt-[40px] md:pt-4">
            <div className="mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 md:h-10 md:w-10 rounded-full border border-gray-200 text-gray-200"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-6 2.69-6 6v1h12v-1c0-3.31-2.67-6-6-6z" />
              </svg>
              <span className="ml-3 text-[14px] md:text-lg font-medium">
                {user?.name || "User"}
              </span>
            </div>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard"
                    className={`block rounded-md px-4 py-2 hover:bg-gray-700 ${
                      pathname === "/dashboard" ? "bg-gray-800" : ""
                    }`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects/new"
                    className={`block rounded-md px-4 py-2 hover:bg-gray-700 ${
                      pathname === "/projects/new" ? "bg-gray-800" : ""
                    }`}
                  >
                    Add New Project
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mytasks"
                    className={`block rounded-md px-4 py-2 hover:bg-gray-700 ${
                      pathname === "/mytasks" ? "bg-gray-800" : ""
                    }`}
                  >
                    My Tasks
                  </Link>
                </li>
                <li>
                  <span className="block px-4 py-2 font-bold">
                    All Projects
                  </span>
                  <ul className="space-y-1 pl-6">
                    {projects?.map((project) => (
                      <li key={project.id} className="relative">
                        <Link
                          href={`/projects/${project.id}`}
                          className={`block rounded-md px-2 py-1 hover:bg-gray-700 ${
                            pathname === `/projects/${project.id}`
                              ? "bg-gray-800"
                              : ""
                          }`}
                        >
                          {project.name}
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          disabled={isDeleting}
                          className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full p-1 hover:bg-gray-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>

            <button
              onClick={() => {
                signOut({ redirect: true, callbackUrl: "/" });
                router.push("/");
              }}
              className="mt-8 w-full rounded-md bg-red-800 px-4 py-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              Logout
            </button>
          </div>
        </aside>
      </div>
    </>
  );
};

export default Sidebar;
