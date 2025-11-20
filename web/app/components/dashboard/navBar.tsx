"use client";

import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
              U
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <MobileSidebarContent onNavigate={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>
    </>
  );
}

function MobileSidebarContent({ onNavigate }: { onNavigate: () => void }) {
  const { useRouter } = require("next/navigation");
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
    onNavigate();
  };

  return (
    <nav className="space-y-2">
      <button
        onClick={() => handleNavigation("/dashboard/users/create")}
        className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium"
      >
        Create User
      </button>
      <button
        onClick={() => handleNavigation("/dashboard/categories/create")}
        className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 text-gray-700 font-medium"
      >
        Create Category
      </button>
    </nav>
  );
}
