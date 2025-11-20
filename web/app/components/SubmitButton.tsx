"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface SubmitButtonProps {
  onClick?: () => void;
  isLoading?: boolean;
  text: string;
  loadingText?: string;
  Icon?: LucideIcon;
  type?: "button" | "submit";
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onClick,
  isLoading = false,
  text,
  loadingText = "Loading...",
  Icon,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {text}
        </>
      )}
    </button>
  );
};

export default SubmitButton;
