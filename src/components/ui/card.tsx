import type React from "react"

type CardProps = {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  )
}

export const CardContent: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`p-4 ${className}`}>{children}</div>
}

export const CardFooter: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`flex items-center p-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>{children}</div>
  )
}
