"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function Sidebar() {
  const router = useRouter();
  const { user } = useAuthContext();

  if (!user) return null; // not loaded yet

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    router.push("/login");
  };

  return (
    <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200">
      <nav className="p-4 space-y-2">
        {/* Only SUPERADMIN */}
        {user.role === "SUPERADMIN" && (
          <button
            onClick={() => router.push("/dashboard/users/create")}
            className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Create User
          </button>
        )}

          <button
            onClick={() => router.push("/dashboard/categories/create")}
            className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Create Category
          </button>

        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
