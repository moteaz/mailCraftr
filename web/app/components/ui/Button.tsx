// components/ui/Button.tsx
"use client";

import React from "react";
import type { JSX, SVGProps } from "react";

type IconType = (props: SVGProps<SVGSVGElement>) => JSX.Element;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  Icon?: IconType;
}

const Button: React.FC<ButtonProps> = ({ loading = false, loadingText = "Loading...", Icon, children, className = "", ...props }) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center w-full py-3 px-4 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${className}`}
      disabled={props.disabled || loading}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default React.memo(Button);
