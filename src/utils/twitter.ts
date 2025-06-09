export const extractTweetInfo = (url: string): { username: string; tweetId: string } | null => {
  const patterns = [
    /(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/,
    /(?:twitter\.com|x\.com)\/([^/]+)\/statuses\/(\d+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return {
        username: match[1],
        tweetId: match[2],
      }
    }
  }

  return null
}

export const isTwitterUrl = (url: string): boolean => {
  return /(?:twitter\.com|x\.com)\/[^/]+\/status/.test(url)
}

export const getTweetEmbedUrl = (tweetId: string, theme: "light" | "dark" = "light"): string => {
  return `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=${theme}&width=400&height=600&conversation=none&cards=hidden`
}

export const loadTwitterWidgets = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Check if Twitter widgets script is already loaded
    if (window.twttr) {
      resolve(window.twttr)
      return
    }

    // Create script element
    const script = document.createElement("script")
    script.src = "https://platform.twitter.com/widgets.js"
    script.async = true
    script.onload = () => {
      // Wait for twttr to be available
      const checkTwitter = () => {
        if (window.twttr) {
          resolve(window.twttr)
        } else {
          setTimeout(checkTwitter, 100)
        }
      }
      checkTwitter()
    }
    script.onerror = reject

    // Add to document head
    document.head.appendChild(script)
  })
}

// Declare global twttr for TypeScript
declare global {
  interface Window {
    twttr: any
  }
}
