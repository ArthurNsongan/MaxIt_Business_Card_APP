"use client"

import { useState, useEffect, useRef } from "react"
import { TypeIcon as FontIcon } from "lucide-react"

// Popular Google Fonts grouped by category
const googleFonts = {
  "Sans Serif": [
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Inter",
    "Nunito",
    "Source Sans Pro",
    "Raleway",
    "Ubuntu",
  ],
  Serif: [
    "Playfair Display",
    "Merriweather",
    "Lora",
    "PT Serif",
    "Noto Serif",
    "Crimson Text",
    "Libre Baskerville",
    "Bitter",
    "Vollkorn",
    "Cormorant Garamond",
  ],
  Display: [
    "Bebas Neue",
    "Pacifico",
    "Comfortaa",
    "Righteous",
    "Lobster",
    "Permanent Marker",
    "Satisfy",
    "Fredoka One",
    "Abril Fatface",
    "Alfa Slab One",
  ],
  Monospace: [
    "Roboto Mono",
    "Source Code Pro",
    "Fira Code",
    "Space Mono",
    "PT Mono",
    "IBM Plex Mono",
    "Inconsolata",
    "Ubuntu Mono",
    "JetBrains Mono",
    "Courier Prime",
  ],
}

// Flatten the fonts array for search
const allFonts = Object.values(googleFonts).flat()

export default function FontSelector({ initialValue = "Roboto", onChange }) {
  const [selectedFont, setSelectedFont] = useState(initialValue)
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loadedFonts, setLoadedFonts] = useState([])
  const popoverRef = useRef(null)

  // Update selected font when initialValue changes
  useEffect(() => {
    setSelectedFont(initialValue)
  }, [initialValue])

  // Handle click outside to close popover
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Load Google Fonts
  useEffect(() => {
    // Function to load a font
    const loadFont = (fontName) => {
      if (loadedFonts.includes(fontName)) return

      // Create a link element for the Google Font
      const link = document.createElement("link")
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@400;700&display=swap`
      link.rel = "stylesheet"
      document.head.appendChild(link)

      setLoadedFonts((prev) => [...prev, fontName])
    }

    // Load the selected font
    loadFont(selectedFont)

    // Load visible fonts when dropdown is open
    if (isOpen) {
      const fontsToLoad = searchQuery
        ? allFonts.filter((font) => font.toLowerCase().includes(searchQuery.toLowerCase()))
        : allFonts.slice(0, 20) // Load first 20 fonts initially

      fontsToLoad.forEach(loadFont)
    }
  }, [selectedFont, isOpen, searchQuery, loadedFonts])

  // Handle font selection
  const handleFontSelect = (fontName) => {
    setSelectedFont(fontName)
    if (onChange) {
      onChange(fontName)
    }
    setIsOpen(false)
  }

  // Filter fonts based on search query
  const getFilteredFonts = () => {
    if (!searchQuery) return googleFonts

    const filtered = {}

    Object.entries(googleFonts).forEach(([category, fonts]) => {
      const matchingFonts = fonts.filter((font) => font.toLowerCase().includes(searchQuery.toLowerCase()))

      if (matchingFonts.length > 0) {
        filtered[category] = matchingFonts
      }
    })

    return filtered
  }

  const filteredFonts = getFilteredFonts()

  return (
    <div className="w-full relative" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left font-normal h-14 px-4 relative overflow-hidden border-2 rounded-md transition-all duration-300 focus:outline-none"
        style={{ borderColor: "#e2e8f0" }}
      >
        <div className="flex items-center gap-3 z-10">
          <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100">
            <FontIcon className="h-4 w-4 opacity-50" />
          </div>
          <span style={{ fontFamily: `"${selectedFont}", sans-serif` }}>{selectedFont}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 opacity-50"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Popover Content */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full max-w-md p-3 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-auto">
          {/* Search Input */}
          <div className="mb-3">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                placeholder="Search fonts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Font Categories */}
          <div className="space-y-4">
            {Object.keys(filteredFonts).length > 0 ? (
              Object.entries(filteredFonts).map(([category, fonts]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{category}</h3>
                  <div className="space-y-1">
                    {fonts.map((font) => (
                      <button
                        key={font}
                        onClick={() => handleFontSelect(font)}
                        className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors ${
                          selectedFont === font ? "bg-gray-100" : ""
                        }`}
                      >
                        <span style={{ fontFamily: `"${font}", sans-serif` }} className="block text-base">
                          {font}
                        </span>
                        <span className="block text-xs text-gray-500 mt-1">
                          The quick brown fox jumps over the lazy dog
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No fonts found matching "{searchQuery}"</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
