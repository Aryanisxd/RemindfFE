"use client"

import type React from "react"
import { TrashIcon, EyeIcon, LinkUploadIcon, DocumentIcon, LinkIcon, VideoIcon, TwitterIcon } from "./ui/icons"
import { extractYouTubeVideoId, getYouTubeThumbnail, isYouTubeUrl } from "../utils/youtube"
import { isTwitterUrl } from "../utils/twitter"

export type ContentType = "note" | "link" | "video" | "tweet"

export interface ContentItem {
  id: string
  type: ContentType
  title: string
  content: string
  link?: string
  tags: string[]
}

interface ContentCardProps {
  item: ContentItem
  onDelete: (id: string) => void
  onPreview: (id: string) => void
  onShare: (id: string) => void
  onShowToast: (message: string) => void
  darkMode: boolean
}

export const ContentCard: React.FC<ContentCardProps> = ({
  item,
  onDelete,
  onPreview,
  onShare,
  onShowToast,
  darkMode,
}) => {
  const getIcon = () => {
    switch (item.type) {
      case "note":
        return <DocumentIcon className="w-4 h-4" />
      case "link":
        return <LinkIcon className="w-4 h-4" />
      case "video":
        return <VideoIcon className="w-4 h-4" />
      case "tweet":
        return <TwitterIcon className="w-4 h-4" />
      default:
        return <DocumentIcon className="w-4 h-4" />
    }
  }

  const handleLinkClick = () => {
    if (item.link && item.link.trim()) {
      onShowToast("Redirecting...")
      setTimeout(() => {
        try {
          const url = new URL(item.link!)
          window.open(url.toString(), "_blank", "noopener,noreferrer")
        } catch (error) {
          console.error("Invalid URL:", item.link)
          window.open(item.link!, "_blank", "noopener,noreferrer")
        }
      }, 2000)
    } else {
      onShowToast("No link is provided")
    }
  }

  const handleDelete = () => {
    onDelete(item.id)
    onShowToast("Item deleted")
  }

  const renderYouTubeThumbnail = () => {
    if (item.type === "video" && item.link && isYouTubeUrl(item.link)) {
      const videoId = extractYouTubeVideoId(item.link)
      if (videoId) {
        const thumbnailUrl = getYouTubeThumbnail(videoId, "medium")
        return (
          <div className="mb-3 relative group">
            <img
              src={thumbnailUrl || "/placeholder.svg"}
              alt={`YouTube thumbnail for ${item.title}`}
              className={`w-full h-32 object-cover rounded-lg border ${darkMode ? "border-gray-600" : "border-gray-200"}`}
              onError={(e) => {
                // Hide image if thumbnail fails to load
                e.currentTarget.style.display = "none"
              }}
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        )
      }
    }
    return null
  }

  const renderTweetThumbnail = () => {
    if (item.type === "tweet" && item.link && isTwitterUrl(item.link)) {
      return (
        <div className="mb-3 relative group">
          <div
            className={`w-full h-32 rounded-lg border flex items-center justify-center transition-colors duration-200 ${
              darkMode
                ? "bg-gray-800 border-gray-600 hover:bg-gray-750"
                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {/* Large Twitter Icon */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <TwitterIcon className="w-8 h-8 text-white" />
              </div>
              <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Tweet</span>
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">View Tweet</div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div
      className={`rounded-lg border shadow-sm p-4 h-full flex flex-col transition-colors duration-200 ${
        darkMode
          ? "bg-gray-800 border-gray-600 text-white shadow-gray-900/50"
          : "bg-white border-gray-200 text-black shadow-gray-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>{getIcon()}</span>
          <span className={`font-medium truncate ${darkMode ? "text-white" : "text-gray-900"}`}>{item.title}</span>
        </div>
        <button onClick={handleDelete} className="text-red-500 hover:text-red-400 p-1" aria-label="Delete item">
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>

      {/* YouTube Thumbnail */}
      {renderYouTubeThumbnail()}

      {/* Tweet Thumbnail */}
      {renderTweetThumbnail()}

      {/* Content */}
      <div className="flex-1 mb-4">
        <p className={`text-sm break-words ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{item.content}</p>
        {item.link && (
          <p className={`text-xs mt-2 break-all ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{item.link}</p>
        )}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-full text-xs ${
                  darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                }`}
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                }`}
              >
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onPreview(item.id)
          }}
          className={`flex items-center justify-center flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
            darkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <EyeIcon className="w-4 h-4 mr-2" />
          Preview
        </button>

        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleLinkClick()
          }}
          className={`p-2 rounded-md transition-colors duration-200 ${
            darkMode
              ? "text-gray-400 hover:text-white hover:bg-gray-700"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          aria-label="Open link"
        >
          <LinkUploadIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
