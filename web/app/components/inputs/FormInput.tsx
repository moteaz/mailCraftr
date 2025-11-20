"use client";

import { LucideIcon, Mail } from "lucide-react";
import React from "react";

interface FormInputProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  Icon?: LucideIcon;
  error?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  Icon = Mail,
  error,
  disabled = false,
}) => {
  const IconComponent = Icon;

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <IconComponent className="h-5 w-5 text-gray-400" />
        </div>

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-3 py-3 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed`}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
