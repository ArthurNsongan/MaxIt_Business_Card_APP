"use client"

import { useState, useEffect, useRef } from "react"
import { Paintbrush2Icon as PaintBrushIcon } from "lucide-react"

export default function ColorPicker({ initialValue = "#FF5733", onChange, label = "Select Color" }) {
  const [color, setColor] = useState(initialValue)
  const [isOpen, setIsOpen] = useState(false)
  const [hslValues, setHslValues] = useState({ h: 0, s: 100, l: 50 })
  const popoverRef = useRef(null)
  const colorWheelRef = useRef(null)

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  // Convert RGB to HSL - Algorithme amélioré pour plus de précision
  const rgbToHsl = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      if (max === r) {
        h = (g - b) / d + (g < b ? 6 : 0)
      } else if (max === g) {
        h = (b - r) / d + 2
      } else {
        h = (r - g) / d + 4
      }
      
      h /= 6
    }

    return { 
      h: Math.round(h * 360), 
      s: Math.round(s * 100), 
      l: Math.round(l * 100) 
    }
  }

  // Convert HSL to RGB - Algorithme amélioré
  const hslToRgb = (h, s, l) => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    const toHex = (c) => {
      const hex = c.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
  }

  // Update HSL values when color changes
  useEffect(() => {
    const rgb = hexToRgb(color)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    setHslValues(hsl)
  }, [color])

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
    let newColor = e.target.value
    // Valider et formater l'entrée hexadécimale
    if (/^#?([0-9A-F]{3,6})$/i.test(newColor)) {
      if (newColor[0] !== '#') {
        newColor = '#' + newColor
      }
      if (newColor.length === 4) {
        // Convertir format court #RGB en #RRGGBB
        newColor = `#${newColor[1]}${newColor[1]}${newColor[2]}${newColor[2]}${newColor[3]}${newColor[3]}`
      }
      handleColorChange(newColor.toUpperCase())
    }
  }

  // Calcul amélioré de la position dans la roue de couleur
  const getIndicatorPosition = () => {
    const { h, s } = hslValues
    const radius = (s / 100) * 50 // 50% est la distance maximale du centre
    const angleInRadians = ((h + 90) % 360) * (Math.PI / 180) // +90 pour aligner correctement
    
    // Calcule x et y inversés pour un positionnement correct
    const x = 50 + Math.cos(angleInRadians) * radius
    const y = 50 - Math.sin(angleInRadians) * radius

    return { x, y }
  }

  // Gestion améliorée du clic sur la roue de couleur
  const handleColorWheelClick = (e) => {
    if (!colorWheelRef.current) return

    const rect = colorWheelRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calcul précis de la position du clic relative au centre
    const x = e.clientX - rect.left - centerX
    const y = centerY - (e.clientY - rect.top) // Y inversé pour correspondre au système de coordonnées HSL

    // Calcul de l'angle en degrés (hue)
    let angle = Math.atan2(y, x) * (180 / Math.PI)
    if (angle < 0) angle += 360
    const hue = (angle + 270) % 360 // Ajustement pour aligner correctement

    // Calcul de la distance par rapport au centre (saturation)
    const maxRadius = Math.min(centerX, centerY)
    const distance = Math.min(Math.sqrt(x * x + y * y) / maxRadius, 1)
    const saturation = Math.round(distance * 100)

    // Mise à jour des valeurs HSL
    const newHsl = { h: Math.round(hue), s: saturation, l: hslValues.l }
    setHslValues(newHsl)

    // Conversion en RGB puis en HEX
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    const newColor = rgbToHex(rgb.r, rgb.g, rgb.b)

    // Mise à jour de la couleur
    handleColorChange(newColor)
  }

  // Obtenir la position de l'indicateur
  const indicatorPosition = getIndicatorPosition()

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
            {/* Color Wheel améliorée avec luminosité 50% fixe */}
            <div
              ref={colorWheelRef}
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
                boxShadow: "inset 0 0 0 50px white",
                backgroundBlendMode: "multiply"
              }}
              onClick={handleColorWheelClick}
            >
              {/* Superposition radiale pour la saturation */}
              <div className="absolute inset-0 bg-gradient-to-r from-white from-50% to-transparent pointer-events-none" style={{ 
                background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)"
              }} />
              
              {/* Indicateur de sélection */}
              <div
                className="absolute w-4 h-4 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-sm"
                style={{
                  backgroundColor: color,
                  left: `${indicatorPosition.x}%`,
                  top: `${indicatorPosition.y}%`,
                }}
              />
            </div>

            {/* Contrôle de luminosité */}
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="100"
                value={hslValues.l}
                onChange={(e) => {
                  const newL = parseInt(e.target.value)
                  const newHsl = {...hslValues, l: newL}
                  setHslValues(newHsl)
                  
                  const rgb = hslToRgb(newHsl.h, newHsl.s, newL)
                  const newColor = rgbToHex(rgb.r, rgb.g, rgb.b)
                  handleColorChange(newColor)
                }}
                className="w-full h-2 bg-gradient-to-r from-black via-transparent to-white rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs w-8 text-center">{hslValues.l}%</span>
            </div>

            {/* Color Input */}
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md shadow-sm" style={{ backgroundColor: color }} />
              <input
                type="text"
                value={color}
                onChange={handleHexChange}
                className="h-8 w-full bg-transparent border border-gray-200 px-2 rounded focus:outline-none focus:border-gray-400 font-mono"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}