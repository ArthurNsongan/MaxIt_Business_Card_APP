"use client"

import { useState, useEffect, useRef } from "react"

export default function IframeViewer({
  url,
  height = "100%", // Adjust height to fit the viewport minus some padding
  width = "100%",
  title = "Embedded content",
  className = "",
  allowFullscreen = true,
  sandbox = "allow-same-origin allow-scripts allow-popups allow-forms",
}) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUrl, setCurrentUrl] = useState(url)
  const [urlInput, setUrlInput] = useState(url)
  const iframeRef = useRef(null)

  // Reset loading state when URL changes
  useEffect(() => {
    setLoading(true)
    setError(null)
  }, [currentUrl])

  // Handle iframe load events
  const handleLoad = () => {
    setLoading(false)
  }

  // Handle iframe error events
  const handleError = () => {
    setLoading(false)
    setError("Failed to load the URL. It might be restricted from embedding.")
  }

  return (
    <div className={`w-full ${className} rounded-xl shadow p-2`}>


      {/* IFrame Container */}
      <div
        className={`relative w-full overflow-hidden border border-gray-200 rounded-lg shadow-sm bg-white ${className}`}
        style={{ height }}
      >
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
            <div className="flex flex-col items-center">
              <svg
                className="animate-spin h-10 w-10 text-blue-500 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-700">Loading...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
            <div className="text-center p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">Failed to load content</h3>
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          </div>
        )}

        {/* The IFrame */}
        <iframe
          ref={iframeRef}
          src={currentUrl}
          title={title}
          width={width}
          height="100%"
          className={`w-full h-full`}
          onLoad={handleLoad}
          onError={handleError}
          allowFullScreen={allowFullscreen}
          sandbox={sandbox}
        ></iframe>
      </div>
    </div>
  )
}
