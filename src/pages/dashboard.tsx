"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useMemo } from "react"
import { Header } from "../components/header"
import { SearchBar } from "../components/search-bar"
import { ContentGrid } from "../components/content-grid"
import { Sidebar } from "../components/sidebar"
import { AddContentModal } from "../components/add-content-modal"
import { PreviewModal } from "../components/preview-modal"

import { ToastNotification } from "../components/toast-notification"

interface Content {
  _id: string;
  id: string;
  userId: {
    email: string;
  };
  type: ContentType;
  title: string;
  content: string;
  link?: string;
  tags: string[];
}

export type ContentType = "note" | "link" | "video" | "tweet"

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContentType, setSelectedContentType] = useState<ContentType | "all">("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isShareBrainOpen, setIsShareBrainOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Content | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const filteredContents = useMemo(() => {
    console.log('Selected Content Type:', selectedContentType); // Debug log
    console.log('All Contents:', contents); // Debug log
    
    const filtered = contents.filter((item) => {
      if (selectedContentType === "all") return true;
      const itemType = item.type.toLowerCase();
      const selectedType = selectedContentType.toLowerCase();
      console.log(`Comparing item type "${itemType}" with selected type "${selectedType}"`); // Debug log
      console.log(`Item details:`, item); // Debug log
      return itemType === selectedType;
    });
    
    console.log('Filtered Contents:', filtered); // Debug log
    return filtered;
  }, [contents, selectedContentType]);

  const contentCounts = useMemo(() => {
    const counts = {
      all: contents.length,
      note: contents.filter((item) => item.type.toLowerCase() === "note").length,
      link: contents.filter((item) => item.type.toLowerCase() === "link").length,
      video: contents.filter((item) => item.type.toLowerCase() === "video").length,
      tweet: contents.filter((item) => item.type.toLowerCase() === "tweet").length,
    }
    console.log('Content Counts:', counts); // Debug log
    console.log('Raw content types:', contents.map(item => item.type)); // Debug log
    return counts
  }, [contents])

  const fetchContents = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching contents with token:', token); // Debug log
      
      if (!token) {
        navigate('/signin');
        return;
      }

      const response = await axios.get('https://re-mind-eosin.vercel.app/api/v1/content', {
        headers: {
          'Authorization': token.trim(),
          'Content-Type': 'application/json'
        }
      });

      if (response.data && Array.isArray(response.data.contents)) {
        // Log the contents to verify user-specific data
        console.log('Received contents:', response.data.contents);
        
        const mappedData = response.data.contents.map((item: any) => {
          console.log('Mapping item:', item); // Debug log
          
          // Normalize the content type
          let normalizedType = item.type.toLowerCase();
          switch (normalizedType) {
            case 'youtube':
              normalizedType = 'video';
              break;
            case 'document':
            case 'documents':
            case 'note':
            case 'notes':
              normalizedType = 'note';
              break;
            case 'link':
            case 'links':
            case 'url':
              normalizedType = 'link';
              break;
            case 'tweet':
            case 'twitter':
              normalizedType = 'tweet';
              break;
          }
          
          const mappedItem = {
            ...item,
            id: item._id,
            _id: item._id,
            content: item.description,
            type: normalizedType as ContentType
          };
          console.log('Mapped item:', mappedItem); // Debug log
          return mappedItem;
        });
        console.log('Final mapped data:', mappedData); // Debug log
        setContents(mappedData);
      } else {
        setContents([]); // Set empty array if no contents
      }
    } catch (error: any) {
      console.error('Error fetching contents:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/signin');
      } else {
        setError('Failed to load contents. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const confirmed = window.confirm('Are you sure you want to leave? You will be logged out.');
      if (confirmed) {
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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
    console.log('Content Type Selected:', type); // Debug log
    setSelectedContentType(type);
  }

  const handleShare = () => {
    setIsShareBrainOpen(true)
  }

  const handleAddContent = () => {
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      // Find the content item to get its _id
      const contentToDelete = contents.find(item => item._id === id);
      console.log('Content to delete:', contentToDelete); // Debug log

      if (!contentToDelete) {
        handleShowToast("Content not found");
        return;
      }

      console.log('Deleting content with _id:', contentToDelete._id); // Debug log

      const response = await axios.delete(`https://re-mind-eosin.vercel.app/api/v1/content/${contentToDelete._id}`, {
        headers: {
          'Authorization': token.trim(),
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Remove from local state only after successful backend deletion
        setContents(contents.filter((item) => item._id !== id));
        handleShowToast("Content deleted successfully");
      }
    } catch (error: any) {
      console.error('Error deleting content:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('token');
        navigate('/signin');
      } else {
        handleShowToast("Failed to delete content");
      }
    }
  };

  const handlePreview = (id: string) => {
    console.log("Preview clicked for item:", id) // Debug log
    const item = contents.find((item) => item.id === id)
    console.log("Found item:", item) // Debug log
    if (item) {
      setSelectedItem(item)
      setIsPreviewOpen(true)
      console.log("Preview modal should open") // Debug log
    } else {
      handleShowToast("Content not found");
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
    const item = contents.find((item) => item._id === id)
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

  const handleAddNewContent = async (newContent: {
    type: ContentType;
    title: string;
    content: string;
    link?: string;
    tags: string[];
  }) => {
    // Show loading toast
    handleShowToast("Adding content...");
    
    // Fetch updated contents after a short delay to allow backend to process
    setTimeout(async () => {
      await fetchContents();
      handleShowToast("Content added successfully");
    }, 1000);
  }

  const filteredItems = useMemo(() => {
    let filtered = filteredContents

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
  }, [filteredContents, searchQuery])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

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
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-500">{error}</div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-lg">No content found</div>
              </div>
            ) : (
              <ContentGrid
                items={filteredItems}
                onDelete={handleDelete}
                onPreview={handlePreview}
                onShare={handleShareItem}
                onShowToast={handleShowToast}
                darkMode={darkMode}
              />
            )}
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