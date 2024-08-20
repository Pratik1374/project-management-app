"use client";
import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { api } from "@/utils/api";

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { data: projects } = api.project.getProjects.useQuery();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="md:w-64">
      <div className="flex items-center justify-between bg-gray-800 p-4 md:hidden">
        <h2 className="text-lg font-bold text-white">Project Manager</h2>
        <button onClick={toggleSidebar} className="text-white">
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

      <aside
        className={`fixed left-0 top-0 z-40 h-screen transform bg-gray-800 text-white transition-transform duration-300 ease-in-out md:relative ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-6">
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className={`block rounded-md px-4 py-2 hover:bg-gray-700 ${pathname === "/dashboard" ? "bg-gray-900" : ""}`}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/new"
                  className={`block rounded-md px-4 py-2 hover:bg-gray-700 ${pathname === "/projects/new" ? "bg-gray-900" : ""}`}
                >
                  Add New Project
                </Link>
              </li>
              <li>
                <span className="block px-4 py-2 font-bold">All Projects</span>
                <ul className="space-y-1 pl-6">
                  {projects?.map((project) => (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.id}`}
                        className={`block rounded-md px-4 py-1 hover:bg-gray-700 ${pathname === `/projects/${project.id}` ? "bg-gray-900" : ""}`}
                      >
                        {project.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link
                  href="/mytasks"
                  className={`block rounded-md px-4 py-2 hover:bg-gray-700 ${
                    pathname === "/mytasks" ? "bg-gray-900" : ""
                  }`}
                >
                  My Tasks
                </Link>
              </li>
            </ul>
          </nav>

          <button
            onClick={() => signOut()}
            className="mt-8 rounded-md bg-red-500 px-4 py-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
