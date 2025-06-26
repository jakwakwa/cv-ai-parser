"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Camera, User } from "lucide-react"

interface ProfileImageUploaderProps {
  currentImage?: string
  onImageChange?: (imageUrl: string) => void
  showPrompt?: boolean
  onSkip?: () => void
  onComplete?: (imageUrl?: string) => void
}

const ProfileImageUploader = ({
  currentImage = "",
  onImageChange,
  showPrompt = false,
  onSkip,
  onComplete,
}: ProfileImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [previewImage, setPreviewImage] = useState(currentImage)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }, [])

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a JPEG, PNG, or WebP image file."
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return "Image size must be less than 5MB."
    }

    return null
  }

  const resizeImage = (file: File, maxWidth = 400, maxHeight = 400, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img

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

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)

        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality)
        resolve(compressedDataUrl)
      }

      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFile = async (file: File) => {
    setError("")
    setUploading(true)

    try {
      // Validate file
      const validationError = validateFile(file)
      if (validationError) {
        throw new Error(validationError)
      }

      // Resize and compress image
      const compressedImage = await resizeImage(file)

      // Update preview
      setPreviewImage(compressedImage)

      // Call callback if provided
      if (onImageChange) {
        onImageChange(compressedImage)
      }
    } catch (err) {
      console.error("Image upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to process image")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreviewImage("")
    if (onImageChange) {
      onImageChange("")
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    }
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete(previewImage)
    }
  }

  if (showPrompt) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Camera className="h-5 w-5" />
            Add Profile Picture
          </CardTitle>
          <p className="text-sm text-gray-600">Would you like to add a profile picture to your resume?</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {previewImage ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">Click to change image</p>
              </div>
            ) : (
              <div className="space-y-2">
                <User className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-sm font-medium">
                  {uploading ? "Processing..." : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">JPEG, PNG, or WebP (max 5MB)</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSkip} className="flex-1" disabled={uploading}>
              Skip for Now
            </Button>
            <Button onClick={handleComplete} className="flex-1" disabled={uploading}>
              {previewImage ? "Use This Image" : "Continue Without Image"}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Regular editor mode
  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewImage ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Profile preview"
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600">Click to change image</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium">{uploading ? "Processing..." : "Upload Profile Picture"}</p>
              <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, or WebP (max 5MB)</p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
    </div>
  )
}

export default ProfileImageUploader
