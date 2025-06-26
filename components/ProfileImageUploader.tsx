"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Camera } from "lucide-react"

interface ProfileImageUploaderProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
}

const ProfileImageUploader = ({ currentImage, onImageChange }: ProfileImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a JPEG, PNG, or WebP image file."
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return "Image must be smaller than 5MB."
    }

    return null
  }

  const processImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")

          if (!ctx) {
            reject(new Error("Could not get canvas context"))
            return
          }

          // Calculate new dimensions (max 400x400, maintain aspect ratio)
          const maxSize = 400
          let { width, height } = img

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width
              width = maxSize
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height
              height = maxSize
            }
          }

          // Set canvas size and draw image
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to base64 with compression
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8)
          resolve(compressedDataUrl)
        }

        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = e.target?.result as string
      }

      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  const handleFileUpload = async (file: File) => {
    setError("")
    setIsUploading(true)

    try {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      const processedImage = await processImage(file)
      onImageChange(processedImage)
    } catch (err) {
      setError("Failed to process image. Please try again.")
      console.error("Image processing error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleRemoveImage = () => {
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Current Image Display */}
      {currentImage && (
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={currentImage || "/placeholder.svg"}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 shadow-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="space-y-4">
              <div className="flex justify-center">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                ) : (
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Camera className="h-8 w-8 text-gray-600" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {currentImage ? "Replace Profile Picture" : "Upload Profile Picture"}
                </h3>
                <p className="text-sm text-gray-600 mb-4">Drag and drop an image here, or click to browse</p>
                <p className="text-xs text-gray-500">Supports JPEG, PNG, WebP • Max 5MB • Recommended: 400x400px</p>
              </div>

              <Button onClick={handleBrowseClick} disabled={isUploading} className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                {isUploading ? "Processing..." : "Browse Files"}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {currentImage && !error && !isUploading && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">✓ Profile picture uploaded successfully!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfileImageUploader
