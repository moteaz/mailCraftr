// components/ui/Input.tsx
"use client";

import React from "react";
import type { JSX, SVGProps } from "react";

type IconType = (props: SVGProps<SVGSVGElement>) => JSX.Element;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: IconType;
  error?: string | null;
  id?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  id,
  error,
  className,
  ...rest
}) => {
  const inputId = id ?? rest.name ?? undefined;

  return (
    <div className={`w-full ${className ?? ""}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="mt-1 relative">
        {Icon && (
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400" />
          </span>
        )}

        <input
          id={inputId}
          className={`block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition 
            ${Icon ? "pl-10" : "pl-3"} ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default React.memo(Input);
