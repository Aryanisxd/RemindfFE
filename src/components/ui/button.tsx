"use client"

import type React from "react"

type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "dark" | "dark-outline"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  onClick?: () => void
  className?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  onClick,
  className = "",
  icon,
  disabled = false,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  const variantStyles = {
    primary: "bg-black text-white hover:bg-gray-800 focus-visible:ring-gray-900",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",
    outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-900 focus-visible:ring-gray-500",
    dark: "bg-white text-black hover:bg-gray-100 focus-visible:ring-white border border-gray-600",
    "dark-outline": "border border-gray-600 bg-transparent text-white hover:bg-gray-800 focus-visible:ring-gray-400",
  }

  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 py-3 text-lg",
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
}
