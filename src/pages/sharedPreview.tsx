"use client"

import React, { useEffect, useState } from "react"
import { ContentCard } from "../components/content-card"
import { useParams } from "react-router-dom"
import { toast } from "sonner"

interface Tag {
  _id: string
  name: string
}

interface Content {
  _id: string
  title: string
  type: 'Document' | 'Youtube' | 'Tweet' | 'Links'
  link: string
  contents: string
  tags: Tag[]
  userId: string
}

interface User {
  _id: string
  name: string
}

interface SharedPreviewProps {
  darkMode: boolean
}

const SharedPreview: React.FC<SharedPreviewProps> = ({ darkMode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const { userId } = useParams()

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`/api/users/${userId}`)
        const userData = await userResponse.json()
        setUser(userData)

        // Fetch user's content
        const contentResponse = await fetch(`/api/contents/user/${userId}`)
        const contentData = await contentResponse.json()
        setContents(contentData)
      } catch (error) {
        console.error("Error fetching shared content:", error)
        toast.error("Failed to load shared content")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchSharedContent()
    }
  }, [userId])

  const handlePreview = (id: string) => {
    const content = contents.find(c => c._id === id)
    if (content) {
      // TODO: Implement preview functionality based on content type
      switch (content.type) {
        case 'Youtube':
          // Handle YouTube preview
          window.open(content.link, '_blank')
          break
        case 'Tweet':
          // Handle Tweet preview
          window.open(content.link, '_blank')
          break
        case 'Links':
          // Handle link preview
          window.open(content.link, '_blank')
          break
        case 'Document':
          // Handle document preview
          toast.info("Document preview coming soon")
          break
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
          {user?.name}'s Shared Content
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((content) => (
          <ContentCard
            key={content._id}
            item={{
              id: content._id,
              type: content.type.toLowerCase() as any, // Convert to lowercase to match ContentCard type
              title: content.title,
              content: content.contents,
              link: content.link,
              tags: content.tags.map(tag => tag.name)
            }}
            onDelete={() => {}} // No delete functionality in shared view
            onPreview={handlePreview}
            onShare={() => {}} // No share functionality in shared view
            onShowToast={(message) => toast(message)}
            darkMode={darkMode}
          />
        ))}
      </div>

      {contents.length === 0 && (
        <div className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          No shared content available
        </div>
      )}
    </div>
  )
}

export default SharedPreview 