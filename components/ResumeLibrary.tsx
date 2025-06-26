"use client"

import { useState, useEffect } from "react"
import { ResumeDatabase } from "@/lib/database"
import { useAuth } from "./AuthProvider"
import type { Resume } from "@/lib/supabase"

export default function ResumeLibrary({ onSelectResume }: { onSelectResume: (resume: any) => void }) {
  const { user } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      loadResumes()
    }
  }, [user])

  const loadResumes = async () => {
    try {
      setLoading(true)
      const userResumes = await ResumeDatabase.getUserResumes()
      setResumes(userResumes)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resumes")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteResume = async (id: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      try {
        await ResumeDatabase.deleteResume(id)
        setResumes(resumes.filter((r) => r.id !== id))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete resume")
      }
    }
  }

  const handleTogglePublic = async (resume: Resume) => {
    try {
      const updated = await ResumeDatabase.updateResume(resume.id, {
        is_public: !resume.is_public,
      })
      setResumes(resumes.map((r) => (r.id === resume.id ? updated : r)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update resume")
    }
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Please sign in to view your resume library.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading your resumes...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Resume Library</h2>
        <span className="text-sm text-gray-600">
          {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {resumes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No resumes found. Upload your first resume to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800 truncate">{resume.title}</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleTogglePublic(resume)}
                    className={`px-2 py-1 text-xs rounded ${
                      resume.is_public ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {resume.is_public ? "Public" : "Private"}
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p>Method: {resume.parse_method || "Unknown"}</p>
                {resume.confidence_score && <p>Confidence: {resume.confidence_score}%</p>}
                <p>
                  Views: {resume.view_count} | Downloads: {resume.download_count}
                </p>
                <p>Created: {new Date(resume.created_at).toLocaleDateString()}</p>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => onSelectResume(resume.parsed_data)}
                  className="flex-1 bg-teal-600 text-white px-3 py-2 rounded text-sm hover:bg-teal-700 transition-colors"
                >
                  View
                </button>
                {resume.is_public && resume.slug && (
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/resume/${resume.slug}`)}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Share
                  </button>
                )}
                <button
                  onClick={() => handleDeleteResume(resume.id)}
                  className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
