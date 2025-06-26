"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Palette, RotateCcw } from "lucide-react"

interface ColorScheme {
  name: string
  colors: {
    "--mint-light": string
    "--teal-dark": string
    "--charcoal": string
    "--mint-background": string
    "--bronze-dark": string
    "--peach": string
    "--coffee": string
    "--teal-main": string
    "--light-grey-background": string
    "--off-white": string
    "--light-brown-border": string
    "--light-grey-border": string
  }
}

interface ColorPickerProps {
  currentColors: any
  onColorsChange: (colors: any) => void
}

const ColorPicker = ({ currentColors, onColorsChange }: ColorPickerProps) => {
  const defaultColors = {
    "--mint-light": "#d8b08c",
    "--teal-dark": "#1f3736",
    "--charcoal": "#565854",
    "--mint-background": "#c4f0dc",
    "--bronze-dark": "#a67244",
    "--peach": "#f9b87f",
    "--coffee": "#3e2f22",
    "--teal-main": "#116964",
    "--light-grey-background": "#f5f5f5",
    "--off-white": "#faf4ec",
    "--light-brown-border": "#a49990c7",
    "--light-grey-border": "#cecac6",
  }

  const colorSchemes: ColorScheme[] = [
    {
      name: "Default (Teal & Bronze)",
      colors: defaultColors,
    },
    {
      name: "Professional Blue",
      colors: {
        "--mint-light": "#b8d4e3",
        "--teal-dark": "#1e3a5f",
        "--charcoal": "#2c3e50",
        "--mint-background": "#e8f4f8",
        "--bronze-dark": "#34495e",
        "--peach": "#85c1e9",
        "--coffee": "#1b2631",
        "--teal-main": "#2980b9",
        "--light-grey-background": "#f8f9fa",
        "--off-white": "#ffffff",
        "--light-brown-border": "#bdc3c7",
        "--light-grey-border": "#d5dbdb",
      },
    },
    {
      name: "Modern Purple",
      colors: {
        "--mint-light": "#d1c4e9",
        "--teal-dark": "#4a148c",
        "--charcoal": "#424242",
        "--mint-background": "#f3e5f5",
        "--bronze-dark": "#6a1b9a",
        "--peach": "#ce93d8",
        "--coffee": "#2e1065",
        "--teal-main": "#8e24aa",
        "--light-grey-background": "#fafafa",
        "--off-white": "#ffffff",
        "--light-brown-border": "#b39ddb",
        "--light-grey-border": "#e1bee7",
      },
    },
    {
      name: "Warm Orange",
      colors: {
        "--mint-light": "#ffcc80",
        "--teal-dark": "#bf360c",
        "--charcoal": "#3e2723",
        "--mint-background": "#fff3e0",
        "--bronze-dark": "#d84315",
        "--peach": "#ffab40",
        "--coffee": "#1e0a00",
        "--teal-main": "#f57c00",
        "--light-grey-background": "#fafafa",
        "--off-white": "#fffde7",
        "--light-brown-border": "#ffb74d",
        "--light-grey-border": "#ffe0b2",
      },
    },
    {
      name: "Forest Green",
      colors: {
        "--mint-light": "#a5d6a7",
        "--teal-dark": "#1b5e20",
        "--charcoal": "#2e7d32",
        "--mint-background": "#e8f5e8",
        "--bronze-dark": "#388e3c",
        "--peach": "#81c784",
        "--coffee": "#0d3f0f",
        "--teal-main": "#43a047",
        "--light-grey-background": "#f1f8e9",
        "--off-white": "#f9fbe7",
        "--light-brown-border": "#66bb6a",
        "--light-grey-border": "#c8e6c9",
      },
    },
    {
      name: "Elegant Gray",
      colors: {
        "--mint-light": "#cfd8dc",
        "--teal-dark": "#263238",
        "--charcoal": "#37474f",
        "--mint-background": "#eceff1",
        "--bronze-dark": "#455a64",
        "--peach": "#90a4ae",
        "--coffee": "#102027",
        "--teal-main": "#546e7a",
        "--light-grey-background": "#fafafa",
        "--off-white": "#ffffff",
        "--light-brown-border": "#78909c",
        "--light-grey-border": "#b0bec5",
      },
    },
  ]

  const [selectedScheme, setSelectedScheme] = useState<string>("Default (Teal & Bronze)")

  const handleSchemeSelect = (scheme: ColorScheme) => {
    setSelectedScheme(scheme.name)
    onColorsChange(scheme.colors)
  }

  const handleReset = () => {
    setSelectedScheme("Default (Teal & Bronze)")
    onColorsChange(defaultColors)
  }

  const handleCustomColorChange = (colorKey: string, value: string) => {
    const updatedColors = {
      ...currentColors,
      [colorKey]: value,
    }
    onColorsChange(updatedColors)
    setSelectedScheme("Custom")
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Choose Color Scheme
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Color Schemes */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Preset Themes</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.name}
                onClick={() => handleSchemeSelect(scheme)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedScheme === scheme.name
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.colors["--teal-main"] }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.colors["--bronze-dark"] }} />
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: scheme.colors["--charcoal"] }} />
                </div>
                <p className="text-sm font-medium text-gray-900">{scheme.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Controls */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Custom Colors</h4>
            <Button variant="outline" size="sm" onClick={handleReset} className="flex items-center gap-1">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Accent</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={currentColors["--teal-main"] || defaultColors["--teal-main"]}
                  onChange={(e) => handleCustomColorChange("--teal-main", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-xs text-gray-500">Headers</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={currentColors["--bronze-dark"] || defaultColors["--bronze-dark"]}
                  onChange={(e) => handleCustomColorChange("--bronze-dark", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-xs text-gray-500">Buttons</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={currentColors["--charcoal"] || defaultColors["--charcoal"]}
                  onChange={(e) => handleCustomColorChange("--charcoal", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-xs text-gray-500">Body text</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={currentColors["--off-white"] || defaultColors["--off-white"]}
                  onChange={(e) => handleCustomColorChange("--off-white", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-xs text-gray-500">Sidebar</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accent Light</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={currentColors["--peach"] || defaultColors["--peach"]}
                  onChange={(e) => handleCustomColorChange("--peach", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-xs text-gray-500">Highlights</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dark Text</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={currentColors["--coffee"] || defaultColors["--coffee"]}
                  onChange={(e) => handleCustomColorChange("--coffee", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <span className="text-xs text-gray-500">Content</span>
              </div>
            </div>
          </div>
        </div>

        {/* Color Preview */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <div
              className="text-lg font-bold"
              style={{ color: currentColors["--charcoal"] || defaultColors["--charcoal"] }}
            >
              Your Name
            </div>
            <div
              className="text-sm font-medium"
              style={{ color: currentColors["--teal-main"] || defaultColors["--teal-main"] }}
            >
              Professional Title
            </div>
            <div className="text-sm" style={{ color: currentColors["--coffee"] || defaultColors["--coffee"] }}>
              This is how your resume content will look with the selected colors.
            </div>
            <div
              className="inline-block px-3 py-1 rounded text-white text-xs"
              style={{ backgroundColor: currentColors["--bronze-dark"] || defaultColors["--bronze-dark"] }}
            >
              Button Style
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ColorPicker
