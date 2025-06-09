"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { extractTweetInfo, loadTwitterWidgets } from "../utils/twitter"

interface TwitterEmbedProps {
  url: string
  darkMode?: boolean
  className?: string
}

export const TwitterEmbed: React.FC<TwitterEmbedProps> = ({ url, darkMode = false, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const embedTweet = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const tweetInfo = extractTweetInfo(url)
        if (!tweetInfo) {
          setError("Invalid Twitter URL")
          setIsLoading(false)
          return
        }

        // Load Twitter widgets
        await loadTwitterWidgets()

        // Clear container
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
        }

        // Create tweet embed
        if (window.twttr && containerRef.current) {
          await window.twttr.widgets.createTweet(tweetInfo.tweetId, containerRef.current, {
            theme: darkMode ? "dark" : "light",
            width: 400,
            conversation: "none",
            cards: "hidden",
            align: "center",
          })
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Error embedding tweet:", err)
        setError("Failed to load tweet")
        setIsLoading(false)
      }
    }

    if (url) {
      embedTweet()
    }
  }, [url, darkMode])

  if (error) {
    return (
      <div
        className={`p-4 rounded-lg border text-center ${
          darkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-700"
        } ${className}`}
      >
        <p className="text-sm">{error}</p>
        <p className="text-xs mt-1 opacity-75">Click to view on Twitter/X</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div
          className={`p-8 rounded-lg border text-center ${
            darkMode ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-gray-50 border-gray-200 text-gray-700"
          }`}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-sm">Loading tweet...</p>
        </div>
      )}
      <div ref={containerRef} className={isLoading ? "hidden" : ""} />
    </div>
  )
}
