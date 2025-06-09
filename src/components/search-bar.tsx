"use client"

import type React from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { SearchIcon } from "./ui/icons"

interface SearchBarProps {
  onSearch: (query: string) => void
  onShare: () => void
  onAddContent: () => void
  darkMode: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onAddContent, darkMode }) => {
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  return (
    <div
      className={`flex items-center justify-between gap-4 p-4 transition-colors duration-200 ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Search bar on the left */}
      <div className="flex-grow max-w-md">
        <Input
          placeholder="Search notes, links, tweets..."
          onChange={handleSearch}
          icon={<SearchIcon className={darkMode ? "text-black" : "text-gray-400"} />}
          darkMode={darkMode}
        />
      </div>

      {/* Spacer to push buttons to the right */}
      <div className="flex-1"></div>

      {/* Action buttons on the rightmost side */}
      <div className="flex gap-3 items-center">
        
        <Button variant={darkMode ? "dark" : "primary"} onClick={onAddContent} className="whitespace-nowrap px-4 py-2">
          Create
        </Button>
      </div>
    </div>
  )
}
