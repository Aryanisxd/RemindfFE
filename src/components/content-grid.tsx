import type React from "react"
import { ContentCard, type ContentItem } from "./content-card"

interface ContentGridProps {
  items: ContentItem[]
  onDelete: (id: string) => void
  onPreview: (id: string) => void
  onShare: (id: string) => void
  onShowToast: (message: string) => void
  darkMode: boolean
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  items,
  onDelete,
  onPreview,
  onShare,
  onShowToast,
  darkMode,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ContentCard
          key={item.id}
          item={item}
          onDelete={onDelete}
          onPreview={onPreview}
          onShare={onShare}
          onShowToast={onShowToast}
          darkMode={darkMode}
        />
      ))}
    </div>
  )
}
