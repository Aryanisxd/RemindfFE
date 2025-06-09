"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Header } from "../components/header"
import { SearchBar } from "../components/search-bar"
import { ContentGrid } from "../components/content-grid"
import { Sidebar } from "../components/sidebar"
import type { ContentItem } from "../components/content-card"
import { AddContentModal } from "../components/add-content-modal"
import { PreviewModal } from "../components/preview-modal"
import { ShareBrainModal } from "../components/share-brain-modal"
import { ToastNotification } from "../components/toast-notification"

const initialItems: ContentItem[] = [
  {
    id: "1",
    type: "note",
    title: "ewcewcewcewcew",
    content: "dewdewdefe",
    tags: ["work", "important"],
  },
  {
    id: "2",
    type: "link",
    title: "httddedewde",
    content: "This is a useful documentation link",
    link: "http://example.com/link/to/document",
    tags: ["reference", "documentation"],
  },
  {
    id: "3",
    type: "video",
    title: "dqdqdq",
    content: "Great tutorial video",
    link: "https://www.youtube.com/watch?v=2V6lvCUPT8I",
    tags: ["tutorial", "learning"],
  },
]

export type ContentType = "note" | "link" | "video" | "tweet"

export const Dashboard: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>(initialItems)
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContentType, setSelectedContentType] = useState<ContentType | "all">("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isShareBrainOpen, setIsShareBrainOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const contentCounts = useMemo(() => {
    const counts = {
      all: items.length,
      note: items.filter((item) => item.type === "note").length,
      link: items.filter((item) => item.type === "link").length,
      video: items.filter((item) => item.type === "video").length,
      tweet: items.filter((item) => item.type === "tweet").length,
    }
    return counts
  }, [items])

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleContentTypeSelect = (type: ContentType | "all") => {
    setSelectedContentType(type)
  }

  const handleShare = () => {
    setIsShareBrainOpen(true)
  }

  const handleAddContent = () => {
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handlePreview = (id: string) => {
    console.log("Preview clicked for item:", id) // Debug log
    const item = items.find((item) => item.id === id)
    console.log("Found item:", item) // Debug log
    if (item) {
      setSelectedItem(item)
      setIsPreviewOpen(true)
      console.log("Preview modal should open") // Debug log
    }
  }

  const handleShowToast = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const handleCloseToast = () => {
    setShowToast(false)
  }

  const handleShareItem = (id: string) => {
    const item = items.find((item) => item.id === id)
    if (!item) return

    if (item.link && item.link.trim()) {
      try {
        const url = new URL(item.link)
        window.open(url.toString(), "_blank", "noopener,noreferrer")
      } catch (error) {
        console.error("Invalid URL:", item.link)
        window.open(item.link, "_blank", "noopener,noreferrer")
      }
    } else {
      const shareText = `${item.title}\n\n${item.content}`
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          alert("Content copied to clipboard!")
        })
        .catch((error) => {
          console.error("Failed to copy:", error)
          alert("Failed to copy content")
        })
    }
  }

  const handleAddNewContent = (newContent: {
    type: ContentType
    title: string
    content: string
    link?: string
    tags: string[]
  }) => {
    const newItem = {
      id: Date.now().toString(),
      type: newContent.type,
      title: newContent.title,
      content: newContent.content,
      link: newContent.link,
      tags: newContent.tags,
    }
    setItems([...items, newItem])
    handleShowToast("Content added successfully")
  }

  const filteredItems = useMemo(() => {
    let filtered = items

    if (selectedContentType !== "all") {
      filtered = filtered.filter((item) => item.type === selectedContentType)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.link && item.link.toLowerCase().includes(searchQuery.toLowerCase())) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    return filtered
  }, [items, searchQuery, selectedContentType])

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <Header
        toggleDarkMode={handleToggleDarkMode}
        darkMode={darkMode}
        toggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex h-[calc(100vh-64px)] relative">
        <Sidebar
          selectedType={selectedContentType}
          onTypeSelect={handleContentTypeSelect}
          contentCounts={contentCounts}
          darkMode={darkMode}
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <SearchBar
            onSearch={handleSearch}
            onShare={handleShare}
            onAddContent={handleAddContent}
            darkMode={darkMode}
          />
          <div className={`flex-1 overflow-y-auto ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <ContentGrid
              items={filteredItems}
              onDelete={handleDelete}
              onPreview={handlePreview}
              onShare={handleShareItem}
              onShowToast={handleShowToast}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>

      <AddContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddNewContent}
        darkMode={darkMode}
      />
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false)
          setSelectedItem(null)
        }}
        item={selectedItem}
        darkMode={darkMode}
      />
      <ShareBrainModal
        isOpen={isShareBrainOpen}
        onClose={() => setIsShareBrainOpen(false)}
        onShowToast={handleShowToast}
        darkMode={darkMode}
      />
      <ToastNotification
        message={toastMessage}
        isVisible={showToast}
        onClose={handleCloseToast}
        darkMode={darkMode}
      />
    </div>
  )
}

export default Dashboard