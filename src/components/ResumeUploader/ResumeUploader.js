"use client"

import { useState, useRef } from "react"
import styles from "./ResumeUploader.module.css"
import ProfileImageUploader from "../../../components/ProfileImageUploader"
import { CheckCircle, AlertTriangle, Bot, FileText, Smartphone, Upload, ImageIcon } from "lucide-react"

const ResumeUploader = ({ onResumeUploaded, isLoading, setIsLoading }) => {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState("")
  const [uploadedFile, setUploadedFile] = useState(null)
  const [profileImage, setProfileImage] = useState("")
  const [showProfileUploader, setShowProfileUploader] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0])
    }
  }

  const handleFileSelection = (file) => {
    setError("")

    console.log(`File selected: ${file.name}, type: ${file.type}, size: ${file.size} bytes`)

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ]

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, Word document, or text file.")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB.")
      return
    }

    // Check for empty files
    if (file.size < 100) {
      setError("File appears to be empty or too small.")
      return
    }

    setUploadedFile(file)
  }

  // Enhanced client-side PDF text extraction with better CDN handling
  const extractTextFromPDF = async (file) => {
    console.log("Starting PDF text extraction...")

    try {
      // Method 1: Try with pdfjs-dist using a more reliable import method
      console.log("Attempting PDF.js extraction...")

      // Try to load PDF.js from multiple sources
      let pdfjsLib
      try {
        // First try: Use the bundled version
        pdfjsLib = await import("pdfjs-dist/build/pdf.js")
      } catch (bundleError) {
        console.warn("Bundled PDF.js failed, trying legacy version:", bundleError)
        try {
          // Second try: Use legacy build
          pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.js")
        } catch (legacyError) {
          console.warn("Legacy PDF.js failed, trying CDN:", legacyError)
          // Third try: Load from CDN dynamically
          await loadPDFJSFromCDN()
          pdfjsLib = window.pdfjsLib
        }
      }

      // Set worker source - try multiple CDN options
      if (pdfjsLib.GlobalWorkerOptions) {
        const workerSources = [
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`,
          `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`,
          `https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js`,
        ]

        for (const workerSrc of workerSources) {
          try {
            pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc
            break
          } catch (workerError) {
            console.warn(`Failed to set worker source ${workerSrc}:`, workerError)
          }
        }
      }

      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        verbosity: 0, // Reduce console noise
        disableAutoFetch: true,
        disableStream: true,
      })

      const pdf = await loadingTask.promise
      console.log(`PDF loaded successfully. Pages: ${pdf.numPages}`)

      let fullText = ""

      // Extract text from each page
      for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 10); pageNum++) {
        // Limit to 10 pages for performance
        console.log(`Extracting text from page ${pageNum}`)
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()

        // Combine all text items from the page with proper spacing
        const pageText = textContent.items
          .map((item) => {
            // Add space after each text item to prevent words from running together
            return item.str + (item.hasEOL ? "\n" : " ")
          })
          .join("")

        fullText += pageText + "\n\n"
      }

      const cleanText = fullText.trim()
      console.log(`Extracted ${cleanText.length} characters from PDF`)

      if (cleanText.length < 100) {
        throw new Error("PDF appears to contain very little text content")
      }

      return cleanText
    } catch (pdfError) {
      console.warn("PDF.js extraction failed:", pdfError)

      // Method 2: Try FileReader as fallback (for text-based PDFs)
      try {
        console.log("Attempting FileReader fallback...")
        return await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            const text = e.target.result
            if (typeof text === "string" && text.length > 100) {
              console.log(`FileReader extracted ${text.length} characters`)
              resolve(text)
            } else {
              reject(new Error("FileReader could not extract meaningful text"))
            }
          }
          reader.onerror = () => reject(new Error("FileReader failed"))
          reader.readAsText(file)
        })
      } catch (readerError) {
        console.warn("FileReader fallback failed:", readerError)
        throw new Error(
          "Could not extract text from PDF. This might be a scanned PDF or image-based PDF. Please try converting to a text file or Word document for best results.",
        )
      }
    }
  }

  // Function to load PDF.js from CDN as fallback
  const loadPDFJSFromCDN = () => {
    return new Promise((resolve, reject) => {
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib)
        return
      }

      const script = document.createElement("script")
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
      script.onload = () => {
        if (window.pdfjsLib) {
          resolve(window.pdfjsLib)
        } else {
          reject(new Error("PDF.js failed to load from CDN"))
        }
      }
      script.onerror = () => reject(new Error("Failed to load PDF.js from CDN"))
      document.head.appendChild(script)
    })
  }

  // Client-side text extraction for different file types
  const extractTextFromFile = async (file) => {
    console.log(`Extracting text from file: ${file.name} (${file.type})`)

    if (file.type === "application/pdf") {
      return await extractTextFromPDF(file)
    } else if (file.type === "text/plain") {
      console.log("Reading text file...")
      const text = await file.text()
      if (text.length < 50) {
        throw new Error("Text file appears to be empty or too short")
      }
      return text
    } else if (
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      console.log("Attempting to read Word document...")
      try {
        // Try to read as text (this works for some Word docs)
        const text = await file.text()
        if (text.length > 50) {
          return text
        }
        throw new Error("Could not extract readable text from Word document")
      } catch (wordError) {
        throw new Error("Word document parsing not fully supported. Please save as PDF or text file for best results.")
      }
    } else {
      throw new Error(`Unsupported file type: ${file.type}. Please use PDF, Word document, or text file.`)
    }
  }

  const handleCreateResume = async () => {
    if (!uploadedFile) {
      setError("Please upload a resume file first.")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      // Extract text from the uploaded file
      console.log("Starting text extraction...")
      const extractedText = await extractTextFromFile(uploadedFile)
      console.log(`Successfully extracted ${extractedText.length} characters`)
      console.log(`Text preview: ${extractedText.substring(0, 300)}...`)

      if (!extractedText || extractedText.trim().length < 50) {
        throw new Error(
          "Could not extract meaningful text from the file. The file might be corrupted, password-protected, or contain only images.",
        )
      }

      // Basic validation - check if it looks like resume content
      const lowerText = extractedText.toLowerCase()
      const hasResumeKeywords =
        lowerText.includes("experience") ||
        lowerText.includes("education") ||
        lowerText.includes("skills") ||
        lowerText.includes("work") ||
        lowerText.includes("job") ||
        lowerText.includes("university") ||
        lowerText.includes("college")

      if (!hasResumeKeywords) {
        console.warn("Text doesn't appear to contain typical resume content")
        // Don't fail here, just warn - let the parsing attempt continue
      }

      // Send extracted text to server for parsing
      console.log("Sending text to server for parsing...")
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: extractedText,
          filename: uploadedFile.name,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Response Error:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (parseError) {
          throw new Error(`Server error: ${response.status} - ${errorText}`)
        }

        if (errorData.error) {
          if (errorData.error.includes("quota") || errorData.error.includes("QUOTA_EXCEEDED")) {
            throw new Error(
              "AI parsing failed: You exceeded your Google Gemini quota. Please check your Google AI Studio billing details.",
            )
          } else if (errorData.error.includes("Request too large") || errorData.error.includes("INVALID_ARGUMENT")) {
            throw new Error(
              "AI parsing failed: The resume is too large for the AI model. Please try a shorter resume or use the text analysis fallback.",
            )
          }
          throw new Error(errorData.error || "Failed to parse resume")
        }
        throw new Error("Server error while parsing resume")
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      // Check if we have valid data
      if (!result.data) {
        throw new Error("No resume data returned from parser")
      }

      console.log(`Parsing completed using ${result.method} with ${result.confidence}% confidence`)

      // Add profile image to parsed data
      const finalResumeData = {
        ...result.data,
        profileImage: profileImage || "", // Empty string means no profile image
      }

      const parseInfo = {
        method: result.method,
        confidence: result.confidence,
        filename: uploadedFile.name,
        fileType: uploadedFile.type,
        fileSize: uploadedFile.size,
      }

      // Reset states
      setUploadedFile(null)
      setProfileImage("")
      setShowProfileUploader(false)
      setError("")
      setIsLoading(false)

      // Call the parent callback
      onResumeUploaded(finalResumeData, parseInfo)
    } catch (err) {
      console.error("Error processing resume:", err)

      // Provide more helpful error messages
      let errorMessage = err.message

      if (errorMessage.includes("PDF")) {
        errorMessage +=
          "\n\nTips for PDF files:\n• Make sure the PDF contains selectable text (not just images)\n• Try saving the PDF from a different source\n• Consider converting to a Word document or text file"
      }

      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const handleProfileImageChange = (imageUrl) => {
    console.log("Profile image changed:", imageUrl)
    setProfileImage(imageUrl)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-900 font-medium mb-2">Creating your resume...</p>
            <p className="text-gray-600 text-sm">Extracting text and analyzing content with Google Gemini...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={styles.uploaderContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Resume Parser</h1>
          <p className={styles.subtitle}>Upload your existing resume and we'll create a beautiful online version</p>
        </div>

        {/* Step 1: Upload Resume File */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Step 1: Upload Your Resume
          </h2>

          {!uploadedFile ? (
            <div
              className={`${styles.dropZone} ${dragActive ? styles.dragActive : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className={styles.fileInput}
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleChange}
              />

              <div className={styles.uploadIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17,8 12,3 7,8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              <p className={styles.dropText}>
                <strong>Click to upload</strong> or drag and drop your resume
              </p>
              <p className={styles.fileTypes}>Supports PDF, Word documents, and text files (max 10MB)</p>
              <p className={styles.fileTypes} style={{ fontSize: "0.8rem", marginTop: "0.5rem", opacity: 0.7 }}>
                For best results with PDFs, ensure they contain selectable text (not scanned images)
              </p>

              <button type="button" className={styles.uploadButton} onClick={onButtonClick}>
                Choose File
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type}
                    </p>
                  </div>
                </div>
                <button onClick={handleRemoveFile} className="text-red-600 hover:text-red-700 font-medium text-sm">
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Optional Profile Image */}
        {uploadedFile && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Step 2: Add Profile Picture (Optional)
            </h2>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">Add a professional profile picture to your resume</p>
                <button
                  onClick={() => setShowProfileUploader(!showProfileUploader)}
                  className="text-teal-600 hover:text-teal-700 font-medium text-sm"
                >
                  {showProfileUploader ? "Hide" : "Add Photo"}
                </button>
              </div>

              {showProfileUploader && (
                <ProfileImageUploader
                  currentImage={profileImage}
                  onImageChange={handleProfileImageChange}
                  showPrompt={false}
                />
              )}

              {profileImage && !showProfileUploader && (
                <div className="flex items-center">
                  <img
                    src={profileImage || "/placeholder.svg"}
                    alt="Profile preview"
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile picture added</p>
                    <button
                      onClick={() => setShowProfileUploader(true)}
                      className="text-sm text-teal-600 hover:text-teal-700"
                    >
                      Change photo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Create Resume Button */}
        {uploadedFile && (
          <div className="mb-8">
            <button
              onClick={handleCreateResume}
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors duration-200"
            >
              {isLoading ? "Creating Resume..." : "Create Resume"}
            </button>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <p style={{ whiteSpace: "pre-line" }}>{error}</p>
          </div>
        )}

        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Bot size={28} />
            </div>
            <h3>Smart Parsing</h3>
            <p>Google Gemini AI-powered parsing when available, with intelligent fallback text analysis</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <FileText size={28} />
            </div>
            <h3>Beautiful Design</h3>
            <p>Your resume gets transformed into a modern, professional layout</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <Smartphone size={28} />
            </div>
            <h3>Responsive</h3>
            <p>Looks great on all devices and can be downloaded as PDF</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeUploader
