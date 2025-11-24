"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Users, FolderOpen } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [userCount, setUserCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          apiClient.get<any>(API_ENDPOINTS.USER.PAGINATED(1, 1)),
          apiClient.get<any>(API_ENDPOINTS.PROJECT.PAGINATED(1, 1)),
        ]);
        setUserCount(usersRes.meta.total);
        setProjectCount(projectsRes.meta.total);
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    };

    fetchCounts();
  }, []);

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: userCount.toString(),
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: FolderOpen,
      label: "Projects",
      value: projectCount.toString(),
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.email?.split("@")[0]} !
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <p className="text-gray-600">
          Use the sidebar to navigate to different sections.
        </p>
      </div>
    </div>
  );
}
