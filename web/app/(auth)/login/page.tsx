// app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    api?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name as "email" | "password"]) {
      setErrors((p) => ({ ...p, [e.target.name]: undefined, api: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // client validation
    const nextErrors: typeof errors = {};
    if (!form.email) nextErrors.email = "Email is required";
    else if (!validateEmail(form.email))
      nextErrors.email = "Please enter a valid email address";

    if (!form.password) nextErrors.password = "Password is required";
    else if (form.password.length < 6)
      nextErrors.password = "Password must be at least 6 characters";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const data = await login(form.email, form.password);
      if (data?.user) {
        router.push("/dashboard");
      } else {
        setErrors({ api: "Unexpected response from the server" });
      }
    } catch (err: any) {
      const message = err?.message ?? "Network error. Please try again.";
      setErrors({ api: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {errors.api && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{errors.api}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              icon={Mail}
              error={errors.email ?? null}
              disabled={loading}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password ?? null}
              disabled={loading}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  disabled={loading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition duration-200"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              loading={loading}
              loadingText="Signing in..."
              Icon={LogIn}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}


