"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import FormInput from "@/app/components/inputs/FormInput";
import SubmitButton from "../components/SubmitButton";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    api: "", // For API errors
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        api: "", // Clear API error too
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side validation
    const newErrors: any = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // API call
    setIsLoading(true);
    setErrors({ email: "", password: "", api: "" }); // Clear all errors

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        if (response.status === 401) {
          setErrors((prev) => ({
            ...prev,
            api: "Invalid email or password",
          }));
        } else if (response.status === 400) {
          setErrors((prev) => ({
            ...prev,
            api: data.message || "Invalid request. Please check your input.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            api: "An error occurred. Please try again later.",
          }));
        }
        return;
      }

      // Success! Store the token
      if (data.accessToken) {
        // Store token in localStorage
        localStorage.setItem("accessToken", data.accessToken);
        console.log("Login successful:", data);

        // Redirect to dashboard or home page
        router.push("/"); // Change this to your desired route
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors((prev) => ({
        ...prev,
        api: "Network error. Please check your connection and try again.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* API Error Message */}
          {errors.api && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{errors.api}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Email Field */}
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              Icon={Mail}
              error={errors.email}
              disabled={isLoading}
            />
            {/* Password Field */}
            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              Icon={Lock}
              error={errors.password}
              disabled={isLoading}
            />
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  disabled={isLoading}
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
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition duration-200"
              >
                Forgot password?
              </a>
            </div>
            {/* Login Button */}
            <SubmitButton
              onClick={handleSubmit}
              isLoading={isLoading}
              text="Sign In"
              loadingText="Signing in..."
              Icon={LogIn}
            />
            ;
          </div>
        </div>
      </div>
    </div>
  );
}
