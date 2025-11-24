"use client";

import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function MobileSidebarContent({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const router = useRouter();
  const { user } = useAuthContext();
    if (!user) return null; // not loaded yet
  const handleNavigation = (path: string) => {
    router.push(path);
    onNavigate();
  };
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    handleNavigation("/login");
  };

  return (
    <nav className="space-y-2">
       {user.role === "SUPERADMIN" && (
      <button
        onClick={() => handleNavigation("/dashboard/users/create")}
        className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium"
      >
        User Management
      </button>
       )}

      <button
        onClick={() => handleNavigation("/dashboard/categories/create")}
        className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium"
      >
        Create Category
      </button>

      <button
        onClick={() => logout()}
        className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium"
      >
        Logout
      </button>
    </nav>
  );
}
