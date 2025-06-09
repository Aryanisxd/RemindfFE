"use client"

import type React from "react"
import { useEffect } from "react"

interface ToastNotificationProps {
  message: string
  isVisible: boolean
  onClose: () => void
  darkMode: boolean
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, isVisible, onClose, darkMode }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])
  

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div
        className={`px-6 py-3 rounded-lg shadow-lg border transition-colors duration-200 ${
          darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        <p className="text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}
