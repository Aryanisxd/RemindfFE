"use client"

import type React from "react"

type InputProps = {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  type?: string
  icon?: React.ReactNode
  darkMode?: boolean
}

export const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChange,
  className = "",
  type = "text",
  icon,
  darkMode = false,
}) => {
  return (
    <div className="relative">
      {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">{icon}</div>}
      <input
        type={type}
        className={`w-full rounded-md border px-4 py-2 text-sm focus:outline-none focus:ring-2 transition-colors duration-200 ${
          darkMode
            ? "bg-gray-800 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            : "bg-white border-gray-300 text-black focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
        } ${icon ? "pl-10" : ""} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
