// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/lib/jwt";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
      if (token && !isTokenExpired(token)) {
        // Use replace so the redirect page isn't kept in history
        router.replace("/dashboard");
      } else {
        localStorage.removeItem("accessToken");
        router.replace("/login");
      }
    } catch (err) {
      // On any error, send to login
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-gray-600">Redirecting…</p>
    </div>
  );
}
