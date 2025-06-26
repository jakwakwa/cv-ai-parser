"use client"

import { useEffect, useState } from "react"
import colors from "./utils/colors"
import { resumeData } from "./utils/resumeData"
import ProfileHeader from "./components/ProfileHeader/ProfileHeader"
import ContactSection from "./components/ContactSection/ContactSection"
import EducationSection from "./components/EducationSection/EducationSection"
import CertificationsSection from "./components/CertificationsSection/CertificationsSection"
import SkillsSection from "./components/SkillsSection/SkillsSection"
import ExperienceSection from "./components/ExperienceSection/ExperienceSection"
import ResumeUploader from "./components/ResumeUploader/ResumeUploader"
import ResumeLibrary from "../components/ResumeLibrary"
import AuthComponent from "../components/AuthComponent"
import ResumeEditor from "../components/ResumeEditor"
import styles from "./App.module.css"
import DownloadButton from "./components/DownloadButton/DownloadButton"
import { useAuth } from "../components/AuthProvider"
import { ResumeDatabase } from "../lib/database"

const App = () => {
  const { user, loading: authLoading } = useAuth()
  const [currentResumeData, setCurrentResumeData] = useState(resumeData)
  const [isUploaded, setIsUploaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentView, setCurrentView] = useState("upload")
  const [currentResumeId, setCurrentResumeId] = useState(null)
  const [showResume, setShowResume] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const scriptId = "html2pdf-script"
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script")
      script.id = scriptId
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
      script.async = true
      document.body.appendChild(script)
      return () => {
        const existingScript = document.getElementById(scriptId)
        if (existingScript) {
          existingScript.remove()
        }
      }
    }
  }, [])

  const handleDownloadPdf = async () => {
    // Increment download count if this is a saved resume
    if (currentResumeId) {
      try {
        await ResumeDatabase.incrementDownloadCount(currentResumeId)
      } catch (error) {
        console.warn("Failed to increment download count:", error)
      }
    }

    const element = document.getElementById("resume-content")
    if (element) {
      const options = {
        margin: 10,
        filename: `${currentResumeData.name.replace(/\s+/g, "_")}_Resume.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }
      if (window.html2pdf) {
        window.html2pdf().from(element).set(options).save()
      } else {
        alert(
          "PDF generation library not loaded. Please try again or use your browser's print to PDF function (Ctrl+P/Cmd+P).",
        )
      }
    }
  }

  const handleResumeUploaded = async (parsedData, parseInfo) => {
    setCurrentResumeData(parsedData)
    setIsUploaded(true)
    setShowResume(true)
    setCurrentView("resume")

    // Save to database if user is logged in
    if (user) {
      try {
        const savedResume = await ResumeDatabase.saveResume({
          title: `${parsedData.name} - ${new Date().toLocaleDateString()}`,
          originalFilename: parseInfo.filename,
          fileType: parseInfo.fileType,
          fileSize: parseInfo.fileSize,
          parsedData: parsedData,
          parseMethod: parseInfo.method,
          confidenceScore: parseInfo.confidence,
          isPublic: false,
        })
        setCurrentResumeId(savedResume.id)
        console.log("Resume saved to database:", savedResume.id)
      } catch (error) {
        console.warn("Failed to save resume to database:", error)
        // Don't block the user experience if saving fails
      }
    }
  }

  const handleSelectResumeFromLibrary = (resumeData) => {
    setCurrentResumeData(resumeData)
    setCurrentView("resume")
    setIsUploaded(true)
    setShowResume(true)
  }

  const handleReset = () => {
    setCurrentResumeData(resumeData)
    setIsUploaded(false)
    setShowResume(false)
    setCurrentView("upload")
    setCurrentResumeId(null)
    setIsEditing(false)
  }

  const handleEditResume = () => {
    setIsEditing(true)
  }

  const handleSaveEdits = async (updatedData) => {
    setCurrentResumeData(updatedData)
    setIsEditing(false)

    // Update in database if user is logged in and resume is saved
    if (user && currentResumeId) {
      try {
        await ResumeDatabase.updateResume(currentResumeId, {
          parsed_data: updatedData,
          updated_at: new Date().toISOString(),
        })
        console.log("Resume updated in database")
      } catch (error) {
        console.warn("Failed to update resume in database:", error)
      }
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  // Always use global data for contact, education, certifications, and profile image from original resume
  // But allow override if uploaded resume has this data
  const contact = currentResumeData.contact || resumeData.contact
  const education = currentResumeData.education || resumeData.education
  const certifications = currentResumeData.certifications || resumeData.certifications
  const profileImage = currentResumeData.profileImage || resumeData.profileImage

  if (authLoading) {
    return (
      <div className={styles.appBg}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show editor view
  if (isEditing) {
    return (
      <div className={styles.appBg}>
        <div className="w-full max-w-6xl mx-auto p-6">
          <ResumeEditor resumeData={currentResumeData} onSave={handleSaveEdits} onCancel={handleCancelEdit} />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.appBg}>
      {/* Navigation */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView("upload")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === "upload" ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Upload Resume
            </button>
            {user && (
              <button
                onClick={() => setCurrentView("library")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "library" ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                My Library
              </button>
            )}
          </div>
          <AuthComponent />
        </div>
      </div>

      {/* Content based on current view */}
      {currentView === "upload" && (
        <>
          {!isUploaded && (
            <ResumeUploader onResumeUploaded={handleResumeUploaded} isLoading={isLoading} setIsLoading={setIsLoading} />
          )}

          {isUploaded && (
            <div className="mb-4 flex gap-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105"
                style={{
                  background: colors["--bronze-dark"],
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: `1px solid ${colors["--coffee"]}`,
                }}
              >
                Upload New Resume
              </button>
              <button
                onClick={handleEditResume}
                className="px-4 py-2 rounded-lg text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105"
                style={{
                  background: colors["--teal-main"],
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  border: `1px solid ${colors["--teal-dark"]}`,
                }}
              >
                Edit Resume
              </button>
              <DownloadButton onClick={handleDownloadPdf} />
            </div>
          )}
        </>
      )}

      {currentView === "library" && user && <ResumeLibrary onSelectResume={handleSelectResumeFromLibrary} />}

      {currentView === "resume" && (
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setCurrentView(user ? "library" : "upload")}
            className="px-4 py-2 rounded-lg text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105"
            style={{
              background: colors["--bronze-dark"],
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: `1px solid ${colors["--coffee"]}`,
            }}
          >
            {user ? "Back to Library" : "Upload New Resume"}
          </button>
          <button
            onClick={handleEditResume}
            className="px-4 py-2 rounded-lg text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105"
            style={{
              background: colors["--teal-main"],
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: `1px solid ${colors["--teal-dark"]}`,
            }}
          >
            Edit Resume
          </button>
          <DownloadButton onClick={handleDownloadPdf} />
        </div>
      )}

      {/* Resume Display */}
      {showResume && (currentView === "resume" || (currentView === "upload" && isUploaded)) && (
        <div id="resume-content" className={styles.resumeContent}>
          <ProfileHeader
            profileImage={profileImage}
            name={currentResumeData.name}
            title={currentResumeData.title}
            summary={currentResumeData.summary}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="flex flex-col md:col-span-1 p-6 md:p-8" style={{ backgroundColor: colors["--off-white"] }}>
              <ContactSection contact={contact} />
              <EducationSection education={education} />
              <CertificationsSection certifications={certifications} />
              <SkillsSection skills={currentResumeData.skills} />
            </div>
            <div className="p-6 md:p-8 md:col-span-2" style={{ color: colors["--coffee"] }}>
              <ExperienceSection experience={currentResumeData.experience} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
