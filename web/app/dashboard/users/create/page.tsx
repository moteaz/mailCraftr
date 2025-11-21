"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, UserPlus, LogIn } from "lucide-react";
import DashboardLayout from "@/app/components/dashboard/dashboardLayout";
import FormInput from "@/app/components/inputs/FormInput";
import SubmitButton from "@/app/components/SubmitButton";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

async function createUser(email: string, password: string, token: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create user");
  }

  return await response.json();
}

export default function CreateUserPage() {
  const { user } = useAuthContext();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [success, setSuccess] = useState(false);

  // Redirect guard for SUPERADMIN only
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role !== "SUPERADMIN") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  // Don't show UI until user is loaded
  if (!user) return null;

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string): boolean =>
    password.length >= 8;

  const handleSubmit = async () => {
    setErrors({});
    setSuccess(false);

    const newErrors: { email?: string; password?: string } = {};

    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email";

    if (!password) newErrors.password = "Password is required";
    else if (!validatePassword(password))
      newErrors.password = "Password must be 8+ characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("Missing authentication token");

      await createUser(email, password, token);

      setSuccess(true);
      setEmail("");
      setPassword("");

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ email: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Create New User
              </h1>
              <p className="text-slate-600">Add a new user to your system</p>
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="text-green-700 text-sm font-medium">
                  ✓ User created successfully!
                </p>
              </motion.div>
            )}

            <div className="space-y-6">
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                Icon={Mail}
                error={errors.email}
                disabled={isLoading}
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••••"
                Icon={Lock}
                error={errors.password}
                disabled={isLoading}
              />

              <SubmitButton
                onClick={handleSubmit}
                isLoading={isLoading}
                text="Create New User"
                loadingText="Creating..."
                Icon={LogIn}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
