"use client"

import type React from "react"
import { MoonIcon, PanelLeftIcon } from "./ui/icons"

interface HeaderProps {
  toggleDarkMode: () => void
  darkMode: boolean
  toggleSidebar: () => void
  isSidebarOpen: boolean
}

export const Header: React.FC<HeaderProps> = ({ toggleDarkMode, darkMode, toggleSidebar, isSidebarOpen }) => {
  return (
    <header
      className={`sticky top-0 z-10 flex items-center justify-between px-4 py-4 border-b transition-colors duration-200 ${
        darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-gray-200"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
            darkMode
              ? `${isSidebarOpen ? "bg-gray-700 text-blue-400" : "hover:bg-gray-800"} text-gray-300 hover:text-white`
              : `${isSidebarOpen ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"} text-gray-600 hover:text-gray-900`
          }`}
          aria-label="Toggle sidebar"
        >
          <PanelLeftIcon className={`w-5 h-5 transition-transform duration-200 ${isSidebarOpen ? "scale-110" : ""}`} />
        </button>
        <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Remind</h1>
      </div>
      <button
        onClick={toggleDarkMode}
        className={`p-2 rounded-full transition-colors duration-200 ${
          darkMode
            ? "bg-gray-800 hover:bg-gray-700 text-yellow-400 hover:text-yellow-300"
            : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
        }`}
        aria-label="Toggle dark mode"
      >
        <MoonIcon />
      </button>
    </header>
  )
}
