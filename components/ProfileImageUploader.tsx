"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Upload, X, Camera, User, Check } from "lucide-react"

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
      const file = e.dataTransfer.files[0]
      handleFile(file)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      handleFile(file)
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
      img.crossOrigin = "anonymous" // Add this for CORS issues with toDataURL

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

      img.onerror = (err) => {
        console.error("Image load error:", err)
        reject(new Error("Failed to load image. It might be a CORS issue or an invalid image file."))
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const handleFile = useCallback(
    async (file: File) => {
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
    },
    [onImageChange],
  )

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
      <Card className="w-full max-w-lg mx-auto shadow-xl border-gray-200 bg-white">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto bg-teal-100 rounded-full p-3 w-fit mb-3">
            <Camera className="h-8 w-8 text-teal-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-gray-800">Add Profile Picture</CardTitle>
          <CardDescription className="text-gray-600 mt-1">
            Make your resume stand out with a professional photo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-2 pb-6 px-6">
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ease-in-out cursor-pointer group
              ${dragActive ? "border-teal-500 bg-teal-50 scale-105" : "border-gray-300 hover:border-gray-400"}
              ${previewImage ? "border-solid border-teal-500" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
          >
            {uploading ? (
              <div className="flex flex-col items-center justify-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-3"></div>
                <p className="text-sm text-gray-600">Processing image...</p>
              </div>
            ) : previewImage ? (
              <div className="space-y-3">
                <div className="relative inline-block group">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Profile preview"
                    className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white shadow-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage()
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-teal-600 font-medium flex items-center justify-center">
                  <Check className="h-5 w-5 mr-1" /> Image Selected
                </p>
                <p className="text-xs text-gray-500">Click image to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 space-y-2 text-gray-500 group-hover:text-teal-600 transition-colors">
                <User className="h-12 w-12 mb-2" />
                <p className="text-base font-medium">Click to upload or drag & drop</p>
                <p className="text-xs">JPEG, PNG, or WebP (max 5MB)</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden" // Visually hidden, but accessible
              disabled={uploading}
              aria-label="Upload profile picture"
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">{error}</div>}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 bg-gray-50 border-t">
          <Button variant="outline" onClick={handleSkip} className="w-full sm:w-auto flex-1" disabled={uploading}>
            Skip for Now
          </Button>
          <Button
            onClick={handleComplete}
            className="w-full sm:w-auto flex-1 bg-teal-600 hover:bg-teal-700"
            disabled={uploading}
          >
            {previewImage ? "Use This Image" : "Continue Without Image"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Regular editor mode (can be styled similarly if needed, or kept simpler)
  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer group
          ${dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-gray-400"}
          ${previewImage ? "border-solid border-teal-500" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-2"></div>
            <p className="text-sm text-gray-600">Processing...</p>
          </div>
        ) : previewImage ? (
          <div className="space-y-2">
            <div className="relative inline-block group">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-white shadow-sm"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage()
                }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <p className="text-xs text-gray-500">Click image to change</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 space-y-1 text-gray-400 group-hover:text-teal-500 transition-colors">
            <Upload className="h-10 w-10 mb-1" />
            <p className="text-sm font-medium">Upload Picture</p>
            <p className="text-xs">Drag & drop or click</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
          aria-label="Upload profile picture"
        />
      </div>
      {error && <div className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</div>}
    </div>
  )
}

export default ProfileImageUploader
