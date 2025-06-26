"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Eye, Download, Trash2, Calendar, Lock, Globe, FileText } from "lucide-react"
import { ResumeDatabase } from "@/lib/database"
import { useAuth } from "./AuthProvider"
import type { Resume } from "@/lib/supabase"

export default function ResumeLibrary({ onSelectResume }: { onSelectResume: (resume: any) => void }) {
  const { user } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

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

  const handleDeleteResume = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to permanently delete "${title}"? This action cannot be undone.`)) {
      try {
        setError("") // Clear any previous errors
        setDeleting(id)
        await ResumeDatabase.deleteResume(id)
        setResumes(resumes.filter((r) => r.id !== id))
        // Optional: Show success message
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete resume")
      } finally {
        setDeleting(null)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "ai":
        return "bg-green-100 text-green-800"
      case "regex_fallback":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "ai":
        return "AI Parsed"
      case "regex_fallback":
        return "Text Analysis"
      default:
        return "Unknown"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
              <p className="text-gray-600">Please sign in to view your resume library.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your resumes...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Resume Library</h2>
          <p className="text-gray-600 mt-1">
            {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-600 mb-4">Upload your first resume to get started!</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <Card key={resume.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-800 truncate flex-1">{resume.title}</h3>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => handleTogglePublic(resume)}
                        className={`px-2 py-1 text-xs rounded ${
                          resume.is_public ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {resume.is_public ? (
                          <>
                            <Globe className="h-3 w-3 inline mr-1" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 inline mr-1" />
                            Private
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-4">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Method:</span>
                      <Badge className={`text-xs ${getMethodBadgeColor(resume.parse_method || "unknown")}`}>
                        {getMethodLabel(resume.parse_method || "unknown")}
                      </Badge>
                    </div>
                    {resume.confidence_score && (
                      <div className="flex items-center justify-between">
                        <span>Confidence:</span>
                        <span className="font-medium text-green-600">{resume.confidence_score}%</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span>Views:</span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {resume.view_count}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Downloads:</span>
                      <span className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {resume.download_count}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Created:</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(resume.created_at)}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex space-x-2 pt-3">
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        disabled={deleting === resume.id}
                        className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting === resume.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{resume.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteResume(resume.id, resume.title)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
