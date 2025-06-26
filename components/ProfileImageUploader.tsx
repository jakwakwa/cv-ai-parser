"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, User, X, Check } from "lucide-react"

interface ProfileImageUploaderProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  showPrompt?: boolean
  onSkip?: () => void
  onComplete?: (imageUrl?: string) => void
}

const ProfileImageUploader = ({
  currentImage,
  onImageChange,
  showPrompt = false,
  onSkip,
  onComplete,
}: ProfileImageUploaderProps) => {
  const [previewImage, setPreviewImage] = useState<string>(currentImage || "")
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      return "Please upload a JPEG, PNG, or WebP image file."
    }

    if (file.size > maxSize) {
      return "File size must be less than 5MB."
    }

    return null
  }

  const processImage = useCallback(
    async (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setIsLoading(true)
      setError("")

      try {
        // Create canvas for resizing
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.onload = () => {
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

          canvas.width = width
          canvas.height = height

          // Draw and compress
          ctx?.drawImage(img, 0, 0, width, height)
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8)

          setPreviewImage(compressedDataUrl)
          onImageChange(compressedDataUrl)
          setIsLoading(false)
        }

        img.onerror = () => {
          setError("Failed to process image. Please try another file.")
          setIsLoading(false)
        }

        img.src = URL.createObjectURL(file)
      } catch (err) {
        setError("Failed to process image. Please try again.")
        setIsLoading(false)
      }
    },
    [onImageChange],
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processImage(e.dataTransfer.files[0])
      }
    },
    [processImage],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        processImage(e.target.files[0])
      }
    },
    [processImage],
  )

  const handleRemoveImage = () => {
    setPreviewImage("")
    onImageChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleSkip = () => {
    console.log("Skip button clicked")
    if (onSkip) {
      onSkip()
    }
  }

  const handleComplete = () => {
    console.log("Complete button clicked with image:", previewImage)
    if (onComplete) {
      onComplete(previewImage)
    }
  }

  // Prompt mode for after resume upload
  if (showPrompt) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg border border-gray-200">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
            <Camera className="h-6 w-6 text-teal-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">Add Profile Picture</CardTitle>
          <CardDescription className="text-gray-600">
            Make your resume stand out with a professional photo.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
              dragActive
                ? "border-teal-500 bg-teal-50 scale-105"
                : previewImage
                  ? "border-solid border-teal-500 bg-gray-50"
                  : "border-gray-300 hover:border-teal-400 bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-3"></div>
                <p className="text-sm text-gray-600">Processing image...</p>
              </div>
            ) : previewImage ? (
              <div className="space-y-3">
                <div className="relative inline-block group">
                  <img
                    src={previewImage || "/placeholder.svg"}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full mx-auto object-cover shadow-md border-4 border-white"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveImage()
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center justify-center text-teal-600">
                  <Check className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Image Selected</span>
                </div>
                <p className="text-xs text-gray-500">Click image to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 space-y-2">
                <User className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-900">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-500">JPEG, PNG, or WebP (max 5MB)</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 p-6 bg-gray-50 border-t">
          <Button variant="outline" onClick={handleSkip} className="flex-1" disabled={isLoading}>
            Skip for Now
          </Button>
          <Button onClick={handleComplete} className="flex-1 bg-teal-600 hover:bg-teal-700" disabled={isLoading}>
            {previewImage ? "Use This Image" : "Continue Without Image"}
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Editor mode for resume editing
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          {previewImage && (
            <div className="relative group">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-gray-200"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <div className="flex-1">
            <Button onClick={handleButtonClick} variant="outline" className="w-full" disabled={isLoading}>
              <Upload className="h-4 w-4 mr-2" />
              {previewImage ? "Change Image" : "Upload Image"}
            </Button>
            <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or WebP (max 5MB)</p>
          </div>
        </div>

        <div
          className={`mt-4 border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            dragActive ? "border-teal-500 bg-teal-50" : "border-gray-300 bg-gray-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <p className="text-sm text-gray-600">Or drag and drop your image here</p>
        </div>

        {isLoading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mr-2"></div>
            <span className="text-sm text-gray-600">Processing...</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileImageUploader
