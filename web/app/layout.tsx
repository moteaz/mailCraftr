// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MailCraftr",
  description: "MailCraftr web app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-white text-slate-900`}>
        <AuthProvider> 
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>

            <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-100">
              © 2025 Your Company. All rights reserved.
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
