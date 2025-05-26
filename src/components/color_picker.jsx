"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Palette, Check } from "lucide-react"

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

const presetColors = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#64748b",
]

export default function ColorPicker({ value = "#3b82f6", onChange, label = "Choose Color" }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(1)
  const [brightness, setBrightness] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [isDraggingHue, setIsDraggingHue] = useState(false)

  const colorSquareRef = useRef(null)
  const hueSliderRef = useRef(null)
  const popoverRef = useRef(null)
  const triggerRef = useRef(null)
  const lastValueRef = useRef(value)

  // Initialize HSV from prop value only when it actually changes
  useEffect(() => {
    if (value !== lastValueRef.current) {
      const [r, g, b] = hexToRgb(value)
      const [h, s, v] = rgbToHsv(r, g, b)
      setHue(h)
      setSaturation(s)
      setBrightness(v)
      lastValueRef.current = value
    }
  }, [value])

  // Convert HSV to hex and call onChange
  const updateColor = useCallback(
    (h, s, v) => {
      const [r, g, b] = hsvToRgb(h, s, v)
      const hex = rgbToHex(r, g, b)
      lastValueRef.current = hex
      onChange?.(hex)
    },
    [onChange],
  )

  const handleColorSquareInteraction = useCallback(
    (e) => {
      if (!colorSquareRef.current) return

      const rect = colorSquareRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))

      const newSaturation = x / rect.width
      const newBrightness = 1 - y / rect.height

      setSaturation(newSaturation)
      setBrightness(newBrightness)
      updateColor(hue, newSaturation, newBrightness)
    },
    [hue, updateColor],
  )

  const handleHueSliderInteraction = useCallback(
    (e) => {
      if (!hueSliderRef.current) return

      const rect = hueSliderRef.current.getBoundingClientRect()
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
      const newHue = (y / rect.height) * 360

      setHue(newHue)
      updateColor(newHue, saturation, brightness)
    },
    [saturation, brightness, updateColor],
  )

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        handleColorSquareInteraction(e)
      }
      if (isDraggingHue) {
        handleHueSliderInteraction(e)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsDraggingHue(false)
    }

    if (isDragging || isDraggingHue) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, isDraggingHue, handleColorSquareInteraction, handleHueSliderInteraction])

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

  const handlePresetColorSelect = (color) => {
    lastValueRef.current = color
    onChange?.(color)
    setIsOpen(false)
  }

  const handleHexInputChange = (hexValue) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hexValue)) {
      lastValueRef.current = hexValue
      onChange?.(hexValue)
    }
  }

  // Get current color for display
  const currentColor = (() => {
    const [r, g, b] = hsvToRgb(hue, saturation, brightness)
    return rgbToHex(r, g, b)
  })()

  const currentHueColor = `hsl(${hue}, 100%, 50%)`
  const cursorX = saturation * 100
  const cursorY = (1 - brightness) * 100

  return (
    <div className="relative w-full">
      <div className="space-y-2">

        <button
          ref={triggerRef}
          type="button"
          className="group relative w-full h-12 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center px-4 h-full">
            <div
              className="w-6 h-6 rounded-lg border-2 border-white shadow-sm ring-1 ring-slate-200"
              style={{ backgroundColor: value }}
            />
            <span className="ml-3 text-sm font-medium text-slate-700 flex-1 text-left">{value.toUpperCase()}</span>
            <Palette className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[40000]" />
          <div
            ref={popoverRef}
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-[40001] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
          >
            <div className="p-6 space-y-6">
              {/* Color Square and Hue Slider */}
              <div className="flex gap-4">
                {/* Color Square */}
                <div className="relative">
                  <div
                    ref={colorSquareRef}
                    className="w-48 h-48 rounded-xl cursor-crosshair relative overflow-hidden border border-slate-200"
                    style={{
                      background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${currentHueColor})`,
                    }}
                    onMouseDown={(e) => {
                      setIsDragging(true)
                      handleColorSquareInteraction(e)
                    }}
                  >
                    {/* Color Cursor */}
                    <div
                      className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${cursorX}%`,
                        top: `${cursorY}%`,
                        boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  </div>
                </div>

                {/* Hue Slider */}
                <div className="relative">
                  <div
                    ref={hueSliderRef}
                    className="w-6 h-48 rounded-lg cursor-pointer relative overflow-hidden border border-slate-200"
                    style={{
                      background:
                        "linear-gradient(to bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                    }}
                    onMouseDown={(e) => {
                      setIsDraggingHue(true)
                      handleHueSliderInteraction(e)
                    }}
                  >
                    {/* Hue Cursor */}
                    <div
                      className="absolute w-8 h-2 bg-white border border-slate-300 rounded-sm shadow-sm pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: "50%",
                        top: `${(hue / 360) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Current Color Display */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-white shadow-sm"
                  style={{ backgroundColor: currentColor }}
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                        if (e.target.value.length === 7) {
                          handleHexInputChange(e.target.value)
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Preset Colors */}
              <div>
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Quick Colors</h4>
                <div className="grid grid-cols-9 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="relative w-8 h-8 rounded-lg hover:scale-110 transition-transform duration-150 ring-2 ring-transparent hover:ring-slate-200"
                      style={{ backgroundColor: color }}
                      onClick={() => handlePresetColorSelect(color)}
                    >
                      {value === color && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white drop-shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
