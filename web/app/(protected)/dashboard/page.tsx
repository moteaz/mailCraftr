"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Users, FolderOpen, FileText } from "lucide-react";
import { StatCard } from "@/components/common/stat-card";

export default function DashboardPage() {
  const { user } = useAuth();
  const [userCount, setUserCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [totalCategoriesCount, setTotalCategoriesCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        if (user?.role === 'SUPERADMIN') {
          const [usersRes, projectsRes, categoriesRes] = await Promise.all([
            apiClient.get<any>(API_ENDPOINTS.USER.PAGINATED(1, 1)),
            apiClient.get<any>(API_ENDPOINTS.PROJECT.PAGINATED(1, 1)),
            apiClient.get<any>(API_ENDPOINTS.CATEGORY.MY_CATEGORIES),
          ]);
          setUserCount(usersRes.meta.total);
          setProjectCount(projectsRes.meta.total);
          setCategoriesCount(categoriesRes.length);
          
          // Get total categories count
          try {
            const allCategoriesRes = await apiClient.get<any>('/categories/all');
            setTotalCategoriesCount(allCategoriesRes.length);
          } catch (err) {
            setTotalCategoriesCount(0);
          }
        } else {
          const [projectsRes, categoriesRes] = await Promise.all([
            apiClient.get<any>(API_ENDPOINTS.PROJECT.MY_PROJECTS),
            apiClient.get<any>(API_ENDPOINTS.CATEGORY.MY_CATEGORIES),
          ]);
          setProjectCount(projectsRes.length);
          setCategoriesCount(categoriesRes.length);
        }
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    };

    if (user) {
      fetchCounts();
    }
  }, [user]);

  const stats = user?.role === 'SUPERADMIN' ? [
    {
      icon: Users,
      label: "Total Users",
      value: userCount.toString(),
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: FolderOpen,
      label: "Total Projects",
      value: projectCount.toString(),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FileText,
      label: "Total Categories",
      value: totalCategoriesCount.toString(),
      color: "from-teal-500 to-green-500",
    },
    {
      icon: FileText,
      label: "My Categories",
      value: categoriesCount.toString(),
      color: "from-green-500 to-emerald-500",
    },
  ] : [
    {
      icon: FolderOpen,
      label: "My Projects",
      value: projectCount.toString(),
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FileText,
      label: "My Categories",
      value: categoriesCount.toString(),
      color: "from-green-500 to-teal-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          Welcome back, {user?.email?.split("@")[0]}!
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            gradient={stat.color}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8 border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">Quick Actions</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Use the sidebar to navigate to different sections.
        </p>
      </div>
    </div>
  );
}
