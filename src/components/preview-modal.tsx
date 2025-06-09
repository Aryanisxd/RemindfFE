"use client"

import React, { useState, useEffect } from "react"
import { CloseIcon, DocumentIcon, LinkIcon, VideoIcon, TwitterIcon, ExternalLinkIcon } from "./ui/icons"
import type { ContentItem } from "./content-card"
import { extractYouTubeVideoId, getYouTubeThumbnail, isYouTubeUrl } from "../utils/youtube"
import { isTwitterUrl } from "../utils/twitter"
import { toast } from "sonner"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  item: ContentItem | null
  darkMode: boolean
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, item, darkMode }) => {
  if (!isOpen || !item) return null

  const getIcon = () => {
    switch (item.type) {
      case "note":
        return <DocumentIcon className="w-6 h-6" />
      case "link":
        return <LinkIcon className="w-6 h-6" />
      case "video":
        return <VideoIcon className="w-6 h-6" />
      case "tweet":
        return <TwitterIcon className="w-6 h-6" />
      default:
        return <DocumentIcon className="w-6 h-6" />
    }
  }

  const getTypeLabel = () => {
    switch (item.type) {
      case "note":
        return "Document"
      case "link":
        return "Link"
      case "video":
        return "YouTube Video"
      case "tweet":
        return "Tweet"
      default:
        return "Document"
    }
  }

  const isValidUrl = (url: string | undefined) => {
    if (!url) return false;
    try {
      new URL(url);
      return url.startsWith('https://');
    } catch {
      return false;
    }
  };

  const handleGoToLink = () => {
    if (isValidUrl(item.link)) {
      window.open(item.link, '_blank');
    } else {
      toast.error('Invalid URL. Link must start with https://');
    }
  };

  const renderYouTubeThumbnail = () => {
    if (item.type === "video" && item.link && isYouTubeUrl(item.link)) {
      const videoId = extractYouTubeVideoId(item.link)
      if (videoId) {
        const thumbnailUrl = getYouTubeThumbnail(videoId, "high")
        return (
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
              Video Preview
            </label>
            <div
              className={`p-3 rounded-lg border transition-colors duration-200 ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="relative group cursor-pointer" onClick={handleGoToLink}>
                <img
                  src={thumbnailUrl || "/placeholder.svg"}
                  alt={`YouTube thumbnail for ${item.title}`}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Click to watch on YouTube
              </p>
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
        <div className="mb-6">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
            Tweet Preview
          </label>
          <div
            className={`p-4 rounded-lg border transition-colors duration-200 ${
              darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="cursor-pointer" onClick={handleGoToLink}>
              <div
                className={`w-full h-48 rounded-lg border flex items-center justify-center transition-colors duration-200 ${
                  darkMode
                    ? "bg-gray-800 border-gray-500 hover:bg-gray-750"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                {/* Large Twitter Icon */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                    <TwitterIcon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                      Twitter/X Post
                    </p>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      Click to view on Twitter/X
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className={`text-sm mt-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Click to view the original tweet on Twitter/X
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  const hasLink = item.link && item.link.trim().length > 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transition-colors duration-200 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b transition-colors duration-200 ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{getIcon()}</span>
            <div>
              <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{item.title}</h2>
              <p className={darkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>{getTypeLabel()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasLink && (
              <button
                onClick={handleGoToLink}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                  darkMode
                    ? "text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                }`}
              >
                <ExternalLinkIcon className="w-4 h-4" />
                Go to Link
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-1 ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}
              aria-label="Close modal"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title Section */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
              Title
            </label>
            <div
              className={`p-3 rounded-lg border transition-colors duration-200 ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}
            >
              <p className={darkMode ? "text-white" : "text-gray-900"}>{item.title}</p>
            </div>
          </div>

          {/* Type Section */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
              Type
            </label>
            <div
              className={`p-3 rounded-lg border transition-colors duration-200 ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={darkMode ? "text-gray-300" : "text-gray-700"}>{getIcon()}</span>
                <span className={darkMode ? "text-white" : "text-gray-900"}>{getTypeLabel()}</span>
              </div>
            </div>
          </div>

          {/* Link Section - Required for all types now */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
              Link <span className="text-red-500">*</span>
            </label>
            <div
              className={`p-3 rounded-lg border transition-colors duration-200 ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}
            >
              {hasLink ? (
                <p
                  className={`break-all cursor-pointer hover:underline ${darkMode ? "text-blue-400" : "text-blue-600"}`}
                  onClick={handleGoToLink}
                >
                  {item.link}
                </p>
              ) : (
                <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>No link provided</p>
              )}
            </div>
          </div>

          {/* YouTube Thumbnail */}
          {renderYouTubeThumbnail()}

          {/* Tweet Thumbnail */}
          {renderTweetThumbnail()}

          {/* Content Section - This is where user's notes appear */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
              {item.type === "tweet" ? "Your Notes" : "Content"}
            </label>
            <div
              className={`p-4 rounded-lg border min-h-[120px] transition-colors duration-200 ${
                darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}
            >
              <p className={`whitespace-pre-wrap break-words ${darkMode ? "text-white" : "text-gray-900"}`}>
                {item.content}
              </p>
            </div>
            {item.type === "tweet" && (
              <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                These are your personal notes about the tweet.
              </p>
            )}
          </div>

          {/* Tags Section */}
          {item.tags.length > 0 && (
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-900"}`}>
                Tags
              </label>
              <div
                className={`p-3 rounded-lg border transition-colors duration-200 ${
                  darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                }`}
              >
                {item.tags.map((tag, index) => (
                  <span key={index} className={darkMode ? "text-gray-300" : "text-gray-700"}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}