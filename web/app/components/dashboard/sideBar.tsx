"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    router.push('/login');
  };

  return (
    <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200">
      <nav className="p-4 space-y-2">
        <button
          onClick={() => handleNavigation("/dashboard/users/create")}
          className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors"
        >
          Create User
        </button>
        <button
          onClick={() => handleNavigation("/dashboard/categories/create")}
          className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors"
        >
          Create Category
        </button>
        <button
          onClick={() => logout()}
          className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium transition-colors"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
