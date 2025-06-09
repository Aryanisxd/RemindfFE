"use client"

import type React from "react"
import { useState } from "react"
import { CloseIcon, LinkUploadIcon, ExternalLinkIcon } from "./ui/icons"

interface ShareBrainModalProps {
  isOpen: boolean
  onClose: () => void
  onShowToast: (message: string) => void
  darkMode: boolean
}

export const ShareBrainModal: React.FC<ShareBrainModalProps> = ({ isOpen, onClose, onShowToast, darkMode }) => {
  const [isPublicSharingEnabled, setIsPublicSharingEnabled] = useState(false)
  const [shareLink] = useState("https://remind.vercel.app/brain/qlbi3dhwj2")
  const [copySuccess, setCopySuccess] = useState(false)

  if (!isOpen) return null

  const handleTogglePublicSharing = () => {
    setIsPublicSharingEnabled(!isPublicSharingEnabled)
    if (!isPublicSharingEnabled) {
      onShowToast("Link is created")
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopySuccess(true)
      onShowToast("Link copied to clipboard")
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error("Failed to copy link:", error)
    }
  }

  const handleOpenLink = () => {
    onShowToast("Redirecting...")
    setTimeout(() => {
      window.open(shareLink, "_blank", "noopener,noreferrer")
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`rounded-lg shadow-xl w-full max-w-md transition-colors duration-200 ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b transition-colors duration-200 ${
            darkMode ? "border-gray-600" : "border-gray-200"
          }`}
        >
          <h2 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Share Your Brain</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded ${
              darkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-600"
            }`}
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Public Sharing Toggle */}
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>Public Sharing</span>
            <button
              onClick={handleTogglePublicSharing}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                isPublicSharingEnabled ? "bg-blue-600" : darkMode ? "bg-gray-600" : "bg-gray-300"
              }`}
              aria-label="Toggle public sharing"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isPublicSharingEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Share Link */}
          {isPublicSharingEnabled && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className={`flex-1 px-3 py-2 text-xs rounded border font-mono transition-colors duration-200 ${
                    darkMode ? "bg-gray-700 border-gray-600 text-gray-300" : "bg-gray-50 border-gray-300 text-gray-700"
                  }`}
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-2 rounded text-xs transition-colors duration-200 ${
                    copySuccess
                      ? "bg-green-600 text-white"
                      : darkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {copySuccess ? "✓" : <LinkUploadIcon className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleOpenLink}
                  className={`px-3 py-2 rounded text-xs transition-colors duration-200 ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                </button>
              </div>
              <p className={`text-xs text-center ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Let them bookmark this as you've remind-ed them • <span className="font-medium">Remind.Inc</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
