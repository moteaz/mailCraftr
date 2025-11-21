"use client";

import { useEffect } from "react";
import DashboardLayout from "@/app/components/dashboard/dashboardLayout";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  // Redirect if user not logged or not superadmin
  useEffect(() => {
    if (!localStorage.getItem("authUser")) {
      router.push("/login");
      return;
    }
  }, [user, router]);

  // Don't render until we know the user data
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Hello Dashboard
        </h1>
      </div>
    </DashboardLayout>
  );
}
