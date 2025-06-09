"use client"

import type React from "react"
import { DocumentIcon, LinkIcon, VideoIcon, TwitterIcon } from "./ui/icons"
import type { ContentType } from "./content-card"

interface SidebarProps {
  selectedType: ContentType | "all"
  onTypeSelect: (type: ContentType | "all") => void
  contentCounts: Record<ContentType | "all", number>
  darkMode: boolean
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedType,
  onTypeSelect,
  contentCounts,
  darkMode,
  isOpen,
  onClose,
}) => {
  const menuItems = [
    {
      id: "all" as const,
      label: "All Content",
      icon: null,
      count: contentCounts.all,
    },
    {
      id: "note" as const,
      label: "Document",
      icon: DocumentIcon,
      count: contentCounts.note,
    },
    {
      id: "link" as const,
      label: "Links",
      icon: LinkIcon,
      count: contentCounts.link,
    },
    {
      id: "video" as const,
      label: "YouTube",
      icon: VideoIcon,
      count: contentCounts.video,
    },
    {
      id: "tweet" as const,
      label: "Tweet",
      icon: TwitterIcon,
      count: contentCounts.tweet || 0,
    },
  ]

  if (!isOpen) return null

  return (
    <>
      {/* Overlay for mobile */}
      <div className="fixed inset-0 bg-black  z-40 md:hidden" onClick={onClose} aria-hidden="true" />

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-16 bottom-0 w-64 border-r h-[calc(100vh-64px)] z-50 transform transition-transform duration-300 ease-in-out md:relative md:top-0 md:z-auto md:transform-none ${
          darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-black"
        } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Content Types</h2>
            <button
              onClick={onClose}
              className={`p-1 rounded-md md:hidden ${
                darkMode
                  ? "hover:bg-gray-800 text-gray-400 hover:text-white"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
              aria-label="Close sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isSelected = selectedType === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTypeSelect(item.id)
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 768) {
                      onClose()
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                    isSelected
                      ? darkMode
                        ? "bg-white text-black"
                        : "bg-black text-white"
                      : darkMode
                        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon ? (
                      <Icon
                        className={`w-5 h-5 ${isSelected ? "text-white": darkMode  ? "text-white" : "text-gray-500" }`}
                      />
                    ) : (
                      <div className="w-5 h-5 flex items-center justify-center">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? "bg-white" : darkMode ? "bg-gray-100" : "bg-gray-400"
                          }`}
                        />
                      </div>
                    )}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      isSelected
                        ? "bg-white bg-opacity-20 text-white"
                        : darkMode
                          ? "bg-gray-800 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
