"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, Trash2, Calendar, Lock, Globe, FileText } from "lucide-react"
import { ResumeDatabase } from "@/lib/database"
import { useAuth } from "./AuthProvider"
import type { Resume } from "@/lib/supabase"
import styles from "./ResumeLibrary.module.css"

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
        return styles.badgeGreen
      case "regex_fallback":
        return styles.badgeYellow
      default:
        return styles.badgeGray
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
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.stateContainer}>
            <div className={styles.stateContent}>
              <div className={styles.iconContainer}>
                <FileText className={styles.icon} />
              </div>
              <h2 className={styles.stateTitle}>Sign In Required</h2>
              <p className={styles.stateText}>Please sign in to view your resume library.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.stateContainer}>
            <div className={styles.stateContent}>
              <div className={styles.loadingSpinner}></div>
              <p className={styles.stateText}>Loading your resumes...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Resume Library</h2>
          <p className={styles.subtitle}>
            {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
          </p>
        </div>

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
          </div>
        )}

        {resumes.length === 0 ? (
          <div className={styles.stateContainer}>
            <div className={styles.stateContent}>
              <div className={styles.iconContainer}>
                <FileText className={styles.iconGray} />
              </div>
              <h3 className={styles.stateTitle}>No resumes yet</h3>
              <p className={styles.stateText}>Upload your first resume to get started!</p>
            </div>
          </div>
        ) : (
          <div className={styles.grid}>
            {resumes.map((resume) => (
              <Card key={resume.id} className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <div className={styles.cardHeaderContent}>
                    <h3 className={styles.cardTitle}>{resume.title}</h3>
                    <div className={styles.publicToggleContainer}>
                      <button
                        onClick={() => handleTogglePublic(resume)}
                        className={`${styles.publicToggle} ${
                          resume.is_public ? styles.publicTogglePublic : styles.publicTogglePrivate
                        }`}
                      >
                        {resume.is_public ? (
                          <>
                            <Globe className={styles.publicToggleIcon} />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock className={styles.publicToggleIcon} />
                            Private
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className={styles.cardContent}>
                  <div className={styles.contentText}>
                    <div className={styles.contentRow}>
                      <span>Method:</span>
                      <Badge className={`${styles.badge} ${getMethodBadgeColor(resume.parse_method || "unknown")}`}>
                        {getMethodLabel(resume.parse_method || "unknown")}
                      </Badge>
                    </div>
                    {resume.confidence_score && (
                      <div className={styles.contentRow}>
                        <span>Confidence:</span>
                        <span className={styles.contentValue}>{resume.confidence_score}%</span>
                      </div>
                    )}
                    <div className={styles.contentRow}>
                      <span>Views:</span>
                      <span className={styles.contentIconContainer}>
                        <Eye className={styles.contentIcon} />
                        {resume.view_count}
                      </span>
                    </div>
                    <div className={styles.contentRow}>
                      <span>Downloads:</span>
                      <span className={styles.contentIconContainer}>
                        <Download className={styles.contentIcon} />
                        {resume.download_count}
                      </span>
                    </div>
                    <div className={styles.contentRow}>
                      <span>Created:</span>
                      <span className={styles.contentIconContainer}>
                        <Calendar className={styles.contentIcon} />
                        {formatDate(resume.created_at)}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className={styles.cardFooter}>
                  <button
                    onClick={() => onSelectResume(resume.parsed_data)}
                    className={styles.viewButton}
                  >
                    View
                  </button>
                  {resume.is_public && resume.slug && (
                    <button
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/resume/${resume.slug}`)}
                      className={styles.shareButton}
                    >
                      Share
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteResume(resume.id, resume.title)}
                    disabled={deleting === resume.id}
                    className={styles.deleteButton}
                  >
                    {deleting === resume.id ? (
                      <div className={styles.deleteSpinner}></div>
                    ) : (
                      <Trash2 className={styles.deleteIcon} />
                    )}
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
