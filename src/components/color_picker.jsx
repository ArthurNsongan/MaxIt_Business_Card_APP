"use client"

import { useState, useEffect, useRef } from "react"
import { Paintbrush2Icon as PaintBrushIcon } from "lucide-react"

export default function ColorPicker({ initialValue = "#FF7900", onChange }) {
  const [color, setColor] = useState(initialValue)
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef(null)

  // Update color when initialValue changes
  useEffect(() => {
    setColor(initialValue)
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

  // Handle color change
  const handleColorChange = (newColor) => {
    setColor(newColor)
    if (onChange) {
      onChange(newColor)
    }
  }

  // Handle hex input change
  const handleHexChange = (e) => {
    const newColor = e.target.value
    handleColorChange(newColor)
  }

  return (
    <div className="w-full relative" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left font-normal h-14 px-4 relative overflow-hidden border-2 rounded-md transition-all duration-300 focus:outline-none"
        style={{ borderColor: color }}
      >
        <div
          className="absolute inset-0 opacity-20 transition-opacity duration-300 hover:opacity-30"
          style={{ backgroundColor: color }}
        />
        <div className="flex items-center gap-3 z-10">
          <div className="h-8 w-8 rounded-full flex items-center justify-center">
            <div className="h-6 w-6 rounded-md shadow-sm" style={{ backgroundColor: color }} />
          </div>
          <span>{color}</span>
        </div>
        <PaintBrushIcon className="h-4 w-4 opacity-50" />
      </button>

      {/* Popover Content */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-64 p-3 bg-white rounded-md shadow-lg border border-gray-200">
          <div className="space-y-3">
            {/* Color Wheel */}
            <div
              className="w-full h-32 rounded-md cursor-pointer relative overflow-hidden"
              style={{
                background: `conic-gradient(
                  from 0deg,
                  hsl(0, 100%, 50%),
                  hsl(60, 100%, 50%),
                  hsl(120, 100%, 50%),
                  hsl(180, 100%, 50%),
                  hsl(240, 100%, 50%),
                  hsl(300, 100%, 50%),
                  hsl(360, 100%, 50%)
                )`,
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left - rect.width / 2
                const y = e.clientY - rect.top - rect.height / 2

                // Calculate hue and saturation from polar coordinates
                const angle = Math.atan2(y, x)
                const hue = ((angle * 180) / Math.PI + 180) % 360

                const distance = Math.min(1, Math.sqrt(x * x + y * y) / (Math.min(rect.width, rect.height) / 2))
                const saturation = distance * 100

                // Convert HSL to RGB to HEX
                const lightness = 50
                const chroma = ((1 - Math.abs((2 * lightness) / 100 - 1)) * saturation) / 100
                const x1 = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
                const m = lightness / 100 - chroma / 2

                let r, g, b
                if (hue < 60) {
                  ;[r, g, b] = [chroma, x1, 0]
                } else if (hue < 120) {
                  ;[r, g, b] = [x1, chroma, 0]
                } else if (hue < 180) {
                  ;[r, g, b] = [0, chroma, x1]
                } else if (hue < 240) {
                  ;[r, g, b] = [0, x1, chroma]
                } else if (hue < 300) {
                  ;[r, g, b] = [x1, 0, chroma]
                } else {
                  ;[r, g, b] = [chroma, 0, x1]
                }

                const toHex = (x) => {
                  const hex = Math.round((x + m) * 255).toString(16)
                  return hex.length === 1 ? "0" + hex : hex
                }

                const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
                handleColorChange(hexColor)
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 rounded-md" />
              <div
                className="absolute w-4 h-4 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-sm"
                style={{
                  backgroundColor: color,
                  left: "50%",
                  top: "50%",
                }}
              />
            </div>

            {/* Color Input */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md shadow-sm" style={{ backgroundColor: color }} />
              <input
                type="text"
                value={color}
                onChange={handleHexChange}
                className="h-8 w-full bg-transparent focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
