"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  CloseIcon,
  DocumentIcon,
  VideoIcon,
  TwitterIcon,
  LinkIcon,
  PlusIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
} from "./ui/icons"
import { Button } from "./ui/button"
import type { ContentType } from "./content-card"
import { extractYouTubeVideoId, getYouTubeThumbnail, isYouTubeUrl } from "../utils/youtube"
import { isTwitterUrl } from "../utils/twitter"

interface AddContentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (content: { type: ContentType; title: string; content: string; link?: string; tags: string[] }) => void
  darkMode: boolean
}

export const AddContentModal: React.FC<AddContentModalProps> = ({ isOpen, onClose, onAdd, darkMode }) => {
  const [selectedType, setSelectedType] = useState<ContentType | "tweet">("note")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [link, setLink] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [youtubePreview, setYoutubePreview] = useState<string | null>(null)
  const [showTweetThumbnail, setShowTweetThumbnail] = useState(false)

  useEffect(() => {
    if (selectedType === "video" && link && isYouTubeUrl(link)) {
      const videoId = extractYouTubeVideoId(link)
      if (videoId) {
        setYoutubePreview(getYouTubeThumbnail(videoId, "medium"))
      } else {
        setYoutubePreview(null)
      }
    } else {
      setYoutubePreview(null)
    }

    if (selectedType === "tweet" && link && isTwitterUrl(link)) {
      setShowTweetThumbnail(true)
    } else {
      setShowTweetThumbnail(false)
    }
  }, [link, selectedType])

  if (!isOpen) return null

  const contentTypes = [
    { id: "note" as const, label: "Document", icon: DocumentIcon },
    { id: "video" as const, label: "YouTube", icon: VideoIcon },
    { id: "tweet" as const, label: "Tweet", icon: TwitterIcon },
    { id: "link" as const, label: "Link", icon: LinkIcon },
  ]

  const handleAddTag = () => {
    const tag = newTag.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setNewTag("")
    }
  }

  // All content types now require links
  const isFormValid = title.trim() && content.trim() && link.trim()

  const handleSubmit = async () => {
    if (isFormValid) {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        console.log('Token being used:', token); // Debug log
        
        if (!token) {
          throw new Error('Please login to create content');
        }

        // Map the frontend types to backend enum values
        const typeMapping: Record<ContentType | "tweet", string> = {
          note: "Document",
          video: "Youtube",
          tweet: "Tweet",
          link: "Links"
        };

        // Log the request data for debugging
        const requestData = {
          type: typeMapping[selectedType],
          title: title.trim(),
          link: link.trim(),
          description: content.trim(),
          tags: tags.map(tag => tag.trim()), // Ensure tags are trimmed strings
        };
        console.log('Sending request with data:', requestData);

        const response = await fetch('http://localhost:8080/api/v1/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token.trim(), // Send raw token
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(requestData),
        });

        // Log the response status and headers
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        // Try to get the response text first
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          console.log('Response is not JSON:', responseText);
        }

        if (!response.ok) {
          console.error('Error response:', errorData);
          if (response.status === 401 || response.status === 403) {
            // Handle authentication errors
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/signin';
            return;
          }
          throw new Error(
            errorData?.message || 
            `Failed to create content: ${response.status} - ${responseText}`
          );
        }

        const responseData = errorData; // We already parsed it above
        console.log('Success response:', responseData);

        const finalType = selectedType as ContentType;
        onAdd({
          type: finalType,
          title: title.trim(),
          content: content.trim(),
          link: link.trim(),
          tags,
        });
        
        setTitle("");
        setContent("");
        setLink("");
        setTags([]);
        setNewTag("");
        setSelectedType("note");
        setYoutubePreview(null);
        setShowTweetThumbnail(false);
        onClose();
      } catch (error) {
        console.error('Error creating content:', error);
        // Show error message to user
        alert(error instanceof Error ? error.message : 'Failed to create content');
      }
    }
  };

  const handleCancel = () => {
    setTitle("")
    setContent("")
    setLink("")
    setTags([])
    setNewTag("")
    setSelectedType("note")
    setYoutubePreview(null)
    setShowTweetThumbnail(false)
    onClose()
  }

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
          <div>
            <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Add New Content</h2>
            <p className={`text-sm mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Add a new note, link, tweet, or YouTube video to your collection
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1 ${darkMode ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}
            aria-label="Close modal"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Add New Content</h3>

          {/* Content Type Selection */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
              Content Type
            </label>
            <div className="grid grid-cols-4 gap-3">
              {contentTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`flex items-center justify-center p-4 rounded-lg border-2 transition-colors duration-200 ${
                      selectedType === type.id
                        ? darkMode
                          ? "border-blue-500 bg-blue-600/20 text-blue-400"
                          : "border-blue-600 bg-blue-50 text-blue-600"
                        : darkMode
                          ? "border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white"
                          : "border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                    }`}
                    title={type.label}
                  >
                    <Icon className="w-6 h-6" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  : "bg-white border-gray-300 text-black focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
              }`}
            />
          </div>

          {/* Link Input - Required for all types */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
              Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder={
                selectedType === "video"
                  ? "Enter YouTube URL"
                  : selectedType === "link"
                    ? "Enter website URL"
                    : selectedType === "tweet"
                      ? "Enter tweet URL"
                      : "Enter document link URL"
              }
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  : "bg-white border-gray-300 text-black focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
              }`}
            />

            {/* YouTube Preview */}
            {youtubePreview && (
              <div className="mt-3">
                <p className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>YouTube Video Preview:</p>
                <div className="relative">
                  <img
                    src={youtubePreview || "/placeholder.svg"}
                    alt="YouTube video thumbnail"
                    className={`w-full h-32 object-cover rounded-lg border ${darkMode ? "border-gray-600" : "border-gray-300"}`}
                    onError={() => setYoutubePreview(null)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tweet Thumbnail Preview */}
            {showTweetThumbnail && (
              <div className="mt-3">
                <p className={`text-sm mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Tweet Preview:</p>
                <div
                  className={`w-full h-32 rounded-lg border flex items-center justify-center transition-colors duration-200 ${
                    darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {/* Large Twitter Icon */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <TwitterIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      Tweet Preview
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`block text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                Content <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1">
                <button
                  className={`p-1 rounded ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <BoldIcon className="w-4 h-4" />
                </button>
                <button
                  className={`p-1 rounded ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <ItalicIcon className="w-4 h-4" />
                </button>
                <button
                  className={`p-1 rounded ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <UnderlineIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                selectedType === "tweet"
                  ? "Add your notes about this tweet..."
                  : "Write your content in Markdown format..."
              }
              rows={6}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-colors duration-200 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                  : "bg-white border-gray-300 text-black focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
              }`}
            />
            <p className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {selectedType === "tweet"
                ? "Add your personal notes or thoughts about this tweet."
                : "Supports Markdown formatting. Use **bold**, *italic*, or __underline__ for formatting."}
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add a tag"
                className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    : "bg-white border-gray-300 text-black focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                }`}
              />
              <button
                onClick={handleAddTag}
                className={`px-4 py-3 border rounded-lg flex items-center justify-center transition-colors duration-200 ${
                  darkMode
                    ? "border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white"
                    : "border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }`}
              >
                <PlusIcon className={`w-5 h-5 ${darkMode ? "text-white" : "text-gray-700"}`} />
              </button>
            </div>

            {/* Selected Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 transition-colors duration-200 ${
                      darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {tag}
                    <button
                      onClick={() => setTags(tags.filter((_, i) => i !== index))}
                      className={darkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end gap-3 p-6 border-t transition-colors duration-200 ${
            darkMode ? "bg-gray-800 border-gray-600" : "bg-gray-50 border-gray-200"
          }`}
        >
          <Button variant={darkMode ? "dark-outline" : "outline"} onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant={darkMode ? "dark" : "primary"} onClick={handleSubmit} disabled={!isFormValid}>
            Add Content
          </Button>
        </div>
      </div>
    </div>
  )
}
