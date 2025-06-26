"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Camera } from "lucide-react"

interface ProfileImageUploaderProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  className?: string
}

const ProfileImageUploader = ({ currentImage, onImageChange, className = "" }: ProfileImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    setError("")
    setUploading(true)

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WebP image.")
      setUploading(false)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.")
      setUploading(false)
      return
    }

    try {
      // Convert to base64 for immediate preview and storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          // Create an image element to validate and potentially resize
          const img = new Image()
          img.onload = () => {
            // Create canvas for resizing if needed
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")

            // Set maximum dimensions
            const maxWidth = 400
            const maxHeight = 400
            let { width, height } = img

            // Calculate new dimensions
            if (width > height) {
              if (width > maxWidth) {
                height = (height * maxWidth) / width
                width = maxWidth
              }
            } else {
              if (height > maxHeight) {
                width = (width * maxHeight) / height
                height = maxHeight
              }
            }

            canvas.width = width
            canvas.height = height

            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height)
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8)

            onImageChange(compressedDataUrl)
            setUploading(false)
          }
          img.onerror = () => {
            setError("Invalid image file.")
            setUploading(false)
          }
          img.src = result
        }
      }
      reader.onerror = () => {
        setError("Failed to read image file.")
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error("Error processing image:", err)
      setError("Failed to process image.")
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    onImageChange("")
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Profile Picture</h3>
            {currentImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            )}
          </div>

          {currentImage ? (
            <div className="space-y-3">
              <div className="relative w-24 h-24 mx-auto">
                <img
                  src={currentImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full border-2 border-gray-200"
                />
              </div>
              <Button variant="outline" size="sm" onClick={onButtonClick} disabled={uploading} className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Change Picture"}
              </Button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <strong>Click to upload</strong> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or WebP (max 5MB)</p>
                </div>
                <Button variant="outline" size="sm" onClick={onButtonClick} disabled={uploading}>
                  {uploading ? "Uploading..." : "Choose Image"}
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleChange}
          />

          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileImageUploader
