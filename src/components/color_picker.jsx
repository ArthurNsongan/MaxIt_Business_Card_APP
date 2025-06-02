"use client"

import { useState, useRef, useEffect } from "react"
import {
  ChevronDown,
  Check,
  Palette,
  Heart,
  Star,
  Zap,
  Sparkles,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Layers,
  Grid,
  Brush,
  Shapes,
} from "lucide-react"

// Convert HSV to RGB
function hsvToRgb(h, s, v) {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let r = 0,
    g = 0,
    b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }

  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)]
}

// Convert RGB to HSV
function rgbToHsv(r, g, b) {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min

  let h = 0
  const s = max === 0 ? 0 : diff / max
  const v = max

  if (diff !== 0) {
    if (max === r) {
      h = ((g - b) / diff) % 6
    } else if (max === g) {
      h = (b - r) / diff + 2
    } else {
      h = (r - g) / diff + 4
    }
    h *= 60
    if (h < 0) h += 360
  }

  return [h, s, v]
}

// Convert RGB to Hex
function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`
}

// Convert Hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
    : [0, 0, 0]
}

// Get color name from hex
function getColorName(hex) {
  const colorNames = {
    "#ef4444": "Rouge",
    "#f97316": "Orange",
    "#eab308": "Jaune",
    "#22c55e": "Vert",
    "#06b6d4": "Cyan",
    "#3b82f6": "Bleu",
    "#8b5cf6": "Violet",
    "#ec4899": "Rose",
    "#64748b": "Gris",
    "#000000": "Noir",
    "#ffffff": "Blanc",
    "#f1f5f9": "Gris clair",
    "#1f2937": "Gris foncé",
    "#fbbf24": "Ambre",
    "#10b981": "Émeraude",
    "#6366f1": "Indigo",
    "#d946ef": "Fuchsia",
    "#f43f5e": "Rose rouge",
  }
  return colorNames[hex.toLowerCase()] || "Couleur"
}

// Check if color is light (for border visibility)
function isLightColor(hex) {
  const [r, g, b] = hexToRgb(hex)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 200
}

const colorCategories = {
  basic: {
    name: "Basiques",
    icon: Palette,
    colors: [
      "#ef4444",
      "#f97316",
      "#eab308",
      "#22c55e",
      "#06b6d4",
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#64748b",
      "#000000",
      "#ffffff",
      "#f1f5f9",
    ],
  },
  warm: {
    name: "Chauds",
    icon: Sun,
    colors: [
      "#dc2626",
      "#ea580c",
      "#d97706",
      "#ca8a04",
      "#f59e0b",
      "#fbbf24",
      "#f87171",
      "#fb7185",
      "#f472b6",
      "#e879f9",
      "#c084fc",
      "#a78bfa",
    ],
  },
  cool: {
    name: "Froids",
    icon: Moon,
    colors: [
      "#0f766e",
      "#0891b2",
      "#0284c7",
      "#2563eb",
      "#4f46e5",
      "#7c3aed",
      "#059669",
      "#0d9488",
      "#06b6d4",
      "#0ea5e9",
      "#3b82f6",
      "#6366f1",
    ],
  },
  nature: {
    name: "Nature",
    icon: Sparkles,
    colors: [
      "#166534",
      "#15803d",
      "#16a34a",
      "#22c55e",
      "#4ade80",
      "#84cc16",
      "#a3e635",
      "#bef264",
      "#365314",
      "#3f6212",
      "#4d7c0f",
      "#65a30d",
    ],
  },
  vibrant: {
    name: "Vibrants",
    icon: Zap,
    colors: [
      "#ff0000",
      "#ff4500",
      "#ffa500",
      "#ffff00",
      "#00ff00",
      "#00ffff",
      "#0000ff",
      "#8000ff",
      "#ff00ff",
      "#ff1493",
      "#00ff7f",
      "#ff6347",
    ],
  },
  pastel: {
    name: "Pastels",
    icon: Heart,
    colors: [
      "#fecaca",
      "#fed7aa",
      "#fde68a",
      "#d9f99d",
      "#a7f3d0",
      "#a5f3fc",
      "#bfdbfe",
      "#c7d2fe",
      "#ddd6fe",
      "#f3e8ff",
      "#fce7f3",
      "#fecdd3",
    ],
  },
  dark: {
    name: "Sombres",
    icon: Star,
    colors: [
      "#1f2937",
      "#374151",
      "#4b5563",
      "#6b7280",
      "#111827",
      "#1e293b",
      "#334155",
      "#475569",
      "#0f172a",
      "#020617",
      "#18181b",
      "#27272a",
    ],
  },
  red: {
    name: "Rouges",
    icon: Droplet,
    colors: [
      "#fef2f2",
      "#fee2e2",
      "#fecaca",
      "#fca5a5",
      "#f87171",
      "#ef4444",
      "#dc2626",
      "#b91c1c",
      "#991b1b",
      "#7f1d1d",
      "#450a0a",
      "#ff0000",
    ],
  },
  orange: {
    name: "Oranges",
    icon: Droplet,
    colors: [
      "#fff7ed",
      "#ffedd5",
      "#fed7aa",
      "#fdba74",
      "#fb923c",
      "#f97316",
      "#ea580c",
      "#c2410c",
      "#9a3412",
      "#7c2d12",
      "#431407",
      "#ff4500",
    ],
  },
  yellow: {
    name: "Jaunes",
    icon: Droplet,
    colors: [
      "#fefce8",
      "#fef9c3",
      "#fef08a",
      "#fde047",
      "#facc15",
      "#eab308",
      "#ca8a04",
      "#a16207",
      "#854d0e",
      "#713f12",
      "#422006",
      "#ffff00",
    ],
  },
  green: {
    name: "Verts",
    icon: Droplet,
    colors: [
      "#f0fdf4",
      "#dcfce7",
      "#bbf7d0",
      "#86efac",
      "#4ade80",
      "#22c55e",
      "#16a34a",
      "#15803d",
      "#166534",
      "#14532d",
      "#052e16",
      "#00ff00",
    ],
  },
  blue: {
    name: "Bleus",
    icon: Droplet,
    colors: [
      "#eff6ff",
      "#dbeafe",
      "#bfdbfe",
      "#93c5fd",
      "#60a5fa",
      "#3b82f6",
      "#2563eb",
      "#1d4ed8",
      "#1e40af",
      "#1e3a8a",
      "#172554",
      "#0000ff",
    ],
  },
  purple: {
    name: "Violets",
    icon: Droplet,
    colors: [
      "#faf5ff",
      "#f3e8ff",
      "#e9d5ff",
      "#d8b4fe",
      "#c084fc",
      "#a855f7",
      "#9333ea",
      "#7e22ce",
      "#6b21a8",
      "#581c87",
      "#3b0764",
      "#8000ff",
    ],
  },
  pink: {
    name: "Roses",
    icon: Droplet,
    colors: [
      "#fdf2f8",
      "#fce7f3",
      "#fbcfe8",
      "#f9a8d4",
      "#f472b6",
      "#ec4899",
      "#db2777",
      "#be185d",
      "#9d174d",
      "#831843",
      "#500724",
      "#ff00ff",
    ],
  },
  gray: {
    name: "Gris",
    icon: Droplet,
    colors: [
      "#f8fafc",
      "#f1f5f9",
      "#e2e8f0",
      "#cbd5e1",
      "#94a3b8",
      "#64748b",
      "#475569",
      "#334155",
      "#1e293b",
      "#0f172a",
      "#020617",
      "#000000",
    ],
  },
  material: {
    name: "Material",
    icon: Layers,
    colors: [
      "#f44336", // Red
      "#e91e63", // Pink
      "#9c27b0", // Purple
      "#673ab7", // Deep Purple
      "#3f51b5", // Indigo
      "#2196f3", // Blue
      "#03a9f4", // Light Blue
      "#00bcd4", // Cyan
      "#009688", // Teal
      "#4caf50", // Green
      "#8bc34a", // Light Green
      "#cddc39", // Lime
      "#ffeb3b", // Yellow
      "#ffc107", // Amber
      "#ff9800", // Orange
      "#ff5722", // Deep Orange
      "#795548", // Brown
      "#9e9e9e", // Grey
    ],
  },
  flat: {
    name: "Flat UI",
    icon: Grid,
    colors: [
      "#1abc9c", // Turquoise
      "#2ecc71", // Emerald
      "#3498db", // Peter River
      "#9b59b6", // Amethyst
      "#34495e", // Wet Asphalt
      "#16a085", // Green Sea
      "#27ae60", // Nephritis
      "#2980b9", // Belize Hole
      "#8e44ad", // Wisteria
      "#2c3e50", // Midnight Blue
      "#f1c40f", // Sunflower
      "#e67e22", // Carrot
      "#e74c3c", // Alizarin
      "#ecf0f1", // Clouds
      "#95a5a6", // Concrete
      "#f39c12", // Orange
      "#d35400", // Pumpkin
      "#c0392b", // Pomegranate
    ],
  },
  social: {
    name: "Social",
    icon: Brush,
    colors: [
      "#1877f2", // Facebook
      "#1da1f2", // Twitter
      "#0077b5", // LinkedIn
      "#e4405f", // Instagram
      "#bd081c", // Pinterest
      "#ff0000", // YouTube
      "#25d366", // WhatsApp
      "#ea4c89", // Dribbble
      "#5865f2", // Discord
      "#7289da", // Discord (old)
      "#00aff0", // Skype
      "#6441a5", // Twitch
      "#ff6600", // Reddit
      "#1db954", // Spotify
      "#ff3300", // SoundCloud
      "#4285f4", // Google
      "#34a853", // Google
      "#fbbc05", // Google
    ],
  },
  web: {
    name: "Web",
    icon: Shapes,
    colors: [
      "#000000", // Black
      "#ffffff", // White
      "#f0f0f0", // Off-white
      "#333333", // Dark gray
      "#666666", // Medium gray
      "#999999", // Light gray
      "#cccccc", // Very light gray
      "#ff0000", // Red
      "#00ff00", // Green
      "#0000ff", // Blue
      "#ffff00", // Yellow
      "#00ffff", // Cyan
      "#ff00ff", // Magenta
      "#c0c0c0", // Silver
      "#808080", // Gray
      "#800000", // Maroon
      "#808000", // Olive
      "#008000", // Dark green
    ],
  },
}

export default function ColorPicker({ value = "#3b82f6", onChange, label = "Couleur" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState("basic")
  const [isMobile, setIsMobile] = useState(false)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(false)
  const popoverRef = useRef(null)
  const triggerRef = useRef(null)
  const categoryTabsRef = useRef(null)
  const activeCategoryRef = useRef(null)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Check for scroll indicators
  useEffect(() => {
    const checkScrollIndicators = () => {
      if (categoryTabsRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = categoryTabsRef.current
        setShowLeftScroll(scrollLeft > 0)
        setShowRightScroll(scrollLeft + clientWidth < scrollWidth - 5) // 5px buffer
      }
    }

    if (isOpen) {
      checkScrollIndicators()
      // Add event listener for scroll
      const tabsElement = categoryTabsRef.current
      if (tabsElement) {
        tabsElement.addEventListener("scroll", checkScrollIndicators)
        return () => tabsElement.removeEventListener("scroll", checkScrollIndicators)
      }
    }
  }, [isOpen, activeCategory])

  // Scroll active category into view when tabs are rendered
  useEffect(() => {
    if (isOpen && activeCategoryRef.current) {
      setTimeout(() => {
        activeCategoryRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        })
      }, 100)
    }
  }, [isOpen, activeCategory])

  const handleColorSelect = (color, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    onChange?.(color)
    setIsOpen(false)
  }

  const scrollTabs = (direction, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    if (categoryTabsRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200
      categoryTabsRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const colorName = getColorName(value)

  // Position the popup
  const getPopupPosition = () => {
    if (!triggerRef.current) return {}

    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    // If there's more space above than below, position above
    if (spaceBelow < 320 && spaceAbove > spaceBelow) {
      return {
        bottom: `${window.innerHeight - rect.top + 8}px`,
        left: `${rect.left}px`,
        maxHeight: `${spaceAbove - 16}px`,
      }
    }

    // Otherwise position below
    return {
      top: `${rect.bottom + 8}px`,
      left: `${rect.left}px`,
      maxHeight: `${spaceBelow - 16}px`,
    }
  }

  if (!isOpen) {
    return (
      <div className="relative w-full">
        <div className="space-y-2">
          {/* <label className="text-sm font-medium text-gray-700">{label}</label> */}
          <button
            ref={triggerRef}
            type="button"
            className="w-full h-12 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center px-3 h-full">
              <div
                className={`w-6 h-6 rounded shadow-sm ${
                  isLightColor(value) ? "border border-gray-300" : "border border-gray-200"
                }`}
                style={{ backgroundColor: value }}
              />
              <span className="ml-3 text-sm font-medium text-gray-700 flex-1 text-left">{colorName}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        </div>
      </div>
    )
  }

  // Mobile Modal
  if (isMobile) {
    return (
      <>
        <div className="relative">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <button
              ref={triggerRef}
              type="button"
              className="w-full h-12 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm"
              onClick={() => setIsOpen(true)}
            >
              <div className="flex items-center px-3 h-full">
                <div
                  className={`w-6 h-6 rounded shadow-sm ${
                    isLightColor(value) ? "border border-gray-300" : "border border-gray-200"
                  }`}
                  style={{ backgroundColor: value }}
                />
                <span className="ml-3 text-sm font-medium text-gray-700 flex-1 text-left">{colorName}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div
            ref={popoverRef}
            className="relative w-[90%] max-w-md bg-white rounded-2xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200 max-h-[80vh] overflow-hidden"
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Choisir une couleur</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Mobile Categories with Scroll Indicators */}
            <div className="relative">
              {showLeftScroll && (
                <button
                  type="button"
                  onClick={(e) => scrollTabs("left", e)}
                  className="absolute left-0 top-0 bottom-0 z-10 w-8 flex items-center justify-center bg-gradient-to-r from-white via-white to-transparent"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}

              <div
                ref={categoryTabsRef}
                className="flex overflow-x-auto py-4 px-8 space-x-2 border-b border-gray-100 scrollbar-hide"
              >
                {Object.entries(colorCategories).map(([key, category]) => {
                  const IconComponent = category.icon
                  return (
                    <button
                      type="button"
                      key={key}
                      ref={activeCategory === key ? activeCategoryRef : null}
                      onClick={() => setActiveCategory(key)}
                      className={`flex-shrink-0 flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${
                        activeCategory === key ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                    </button>
                  )
                })}
              </div>

              {showRightScroll && (
                <button
                  type="button"
                  onClick={(e) => scrollTabs("right", e)}
                  className="absolute right-0 top-0 bottom-0 z-10 w-8 flex items-center justify-center bg-gradient-to-l from-white via-white to-transparent"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>

            {/* Mobile Colors Grid */}
            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-6 gap-3">
                {colorCategories[activeCategory].colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`relative w-12 h-12 rounded-xl shadow-sm hover:scale-110 transition-transform duration-200 active:scale-95 ${
                      isLightColor(color) ? "ring-2 ring-gray-300" : "ring-2 ring-white"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={(e) => handleColorSelect(color, e)}
                  >
                    {value === color && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 text-gray-800" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Desktop Popup
  return (
    <>
      <div className="relative">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <button
            ref={triggerRef}
            type="button"
            className="w-full h-12 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center px-3 h-full">
              <div
                className={`w-6 h-6 rounded shadow-sm ${
                  isLightColor(value) ? "border border-gray-300" : "border border-gray-200"
                }`}
                style={{ backgroundColor: value }}
              />
              <span className="ml-3 text-sm font-medium text-gray-700 flex-1 text-left">{colorName}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Popup */}
      <div className="fixed inset-0 z-40" />
      <div
        ref={popoverRef}
        className="fixed z-50 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200 w-72"
        style={getPopupPosition()}
      >
        {/* Desktop Categories with Scroll Indicators */}
        <div className="relative">
          {showLeftScroll && (
            <button
              type="button"
              onClick={(e) => scrollTabs("left", e)}
              className="absolute left-0 top-0 bottom-0 z-10 w-6 flex items-center justify-center bg-gradient-to-r from-white via-white to-transparent"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
          )}

          <div ref={categoryTabsRef} className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
            {Object.entries(colorCategories).map(([key, category]) => {
              const IconComponent = category.icon
              return (
                <button
                  type="button"
                  key={key}
                  ref={activeCategory === key ? activeCategoryRef : null}
                  onClick={() => setActiveCategory(key)}
                  className={`flex-shrink-0 flex items-center px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    activeCategory === key
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent className="w-3 h-3 mr-1" />
                  {category.name}
                </button>
              )
            })}
          </div>

          {showRightScroll && (
            <button
              type="button"
              onClick={(e) => scrollTabs("right", e)}
              className="absolute right-0 top-0 bottom-0 z-10 w-6 flex items-center justify-center bg-gradient-to-l from-white via-white to-transparent"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>

        {/* Desktop Colors Grid */}
        <div className="p-3">
          <div className="grid grid-cols-8 gap-1.5">
            {colorCategories[activeCategory].colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`relative w-7 h-7 rounded-lg shadow-sm hover:scale-110 transition-transform duration-200 ${
                  isLightColor(color) ? "ring-1 ring-gray-300" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={(e) => handleColorSelect(color, e)}
              >
                {value === color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-2.5 h-2.5 text-gray-800" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
