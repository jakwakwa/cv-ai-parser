"use client"

import { Bot, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import styles from "@/app/page.module.css"
import { usePdfDownloader } from "@/hooks/use-pdf-downloader"
import { useToast } from "@/hooks/use-toast"
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema"
import ResumeDisplayButtons from "@/src/components/resume-display-buttons/resume-display-buttons"
// import TabNavigation from '@/src/components/tab-navigation/TabNavigation';
import { Button } from "@/src/components/ui/ui-button/button"
import ResumeDisplayWithSwitcher from "@/src/containers/resume-display-with-switcher/resume-display-with-switcher"
import ResumeEditor from "@/src/containers/resume-editor/resume-editor"

interface ParseInfo {
    resumeId?: string // Optional for non-auth users
    resumeSlug?: string // Optional for non-auth users
    method: string
    confidence: number
    filename: string
}

export default function PageContent() {
    const router = useRouter()
    const uploaderRef = useRef<HTMLDivElement>(null)
    const { isDownloading, downloadPdf } = usePdfDownloader()
    const { toast } = useToast()

    const [currentView, setCurrentView] = useState("upload") // "upload" | "view" | "edit"
    const [resumeData, setResumeData] = useState<ParsedResumeSchema | null>(null)
    const [parseInfo, setParseInfo] = useState<ParseInfo | null>(null) // Stores ID and Slug from server
    const [isLoading, setIsLoading] = useState(false) // global operations (saving edits, etc.)
    const [error, setError] = useState<string | null>(null)
    const [localCustomColors, setLocalCustomColors] = useState<Record<string, string>>({})

    const handleDownloadPdf = async () => {
        if (resumeData) {
            downloadPdf(document.getElementById("resume-content") as HTMLElement, `${resumeData.name?.replace(/ /g, "_") || "resume"}.pdf`)
        }
    }

    const _handleResumeUploaded = async (parsedData: ParsedResumeSchema, info: ParseInfo) => {
        setResumeData(parsedData)
        setParseInfo(info) // Store the full info including resumeId and resumeSlug
        setIsLoading(false) // Stop main loading

        if (info.resumeSlug) {
            router.push(`/resume/${info.resumeSlug}?toast=resume_uploaded`)
        } else {
            setCurrentView("view")
            if (parsedData.customColors) {
                setLocalCustomColors(parsedData.customColors)
            }
        }
    }

    const handleReset = () => {
        setResumeData(null)
        setParseInfo(null)
        setCurrentView("upload")
        setError(null)
    }

    const handleEditResume = () => {
        setCurrentView("edit")
    }

    const handleSaveEdits = async (updatedData: ParsedResumeSchema) => {
        setIsLoading(true)
        setError(null)

        try {
            if (parseInfo?.resumeId) {
                const response = await fetch(`/api/resumes/${parseInfo.resumeId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ parsedData: updatedData }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.error || "Failed to save resume edits.")
                }

                const result = await response.json()
                setResumeData(result.data)

                if (parseInfo.resumeSlug) {
                    router.push(`/resume/${parseInfo.resumeSlug}?toast=resume_saved`)
                } else {
                    setCurrentView("view")
                }
            } else {
                console.warn("Attempted to save edits on an unsaved resume. This flow needs review.")
                setResumeData(updatedData)
                toast({
                    title: "Info",
                    description: "Edits applied locally. Resume was not saved to database.",
                })
                setCurrentView("view")
            }
        } catch (err: unknown) {
            console.error("Error saving edits:", err)

            let errorMessage = "An unknown error occurred."
            if (err instanceof Error) {
                errorMessage = err.message
            }
            setError(errorMessage)
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelEdit = () => {
        setCurrentView("view")
        setError(null)
    }

    const handleScrollToUploader = () => {
        uploaderRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    }

    useEffect(() => {
        if (isLoading) {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }, [isLoading])

    if (isDownloading) {
        return (
            <div className="loadingContainer">
                <div className="loadingSpinner" />
                <p className="loadingText">Downloading PDF...</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="loadingContainer">
                <div className="loadingSpinner" />
                <p className="loadingText">Creating Resume...</p>
            </div>
        )
    }

    return (
        <main className="mainUserContainer">
            {/* <TabNavigation initialView="upload" /> */}

            {currentView === "upload" && (
                <>
                    <div className="hero">
                        <div className="header">
                            <h1 className="title">Instant Ai Resume Builder</h1>
                            <div className="headerIcon">
                                <Bot size={28} />
                            </div>
                            <p className="text-xs">AI powered by Google Gemini</p>
                            <p className="text-xl mt-4 max-w-md">Upload your existing resume and we'll create a beautiful online version within seconds!</p>
                            <Button className="mt-8" type="button" onClick={handleScrollToUploader}>
                                Try it out!
                            </Button>
                            <div className="flex flex-row gap-2 justify-start mt-2">
                                <span className="text-xs">Free to use</span>
                                <span className="text-xs">-</span>
                                <span className="text-xs">No sign in required</span>
                            </div>
                        </div>
                        <div className="userFeatures">
                            <div className="feature">
                                <div className="featureIcon">
                                    <Bot size={28} />
                                </div>
                                <h3>Smart Ai Parsing</h3>
                                <p>AI-powered parsing when available, with intelligent fallback text analysis.</p>
                            </div>
                        </div>
                    </div>

                    {/* HOMEPAGE FEATURES */}

                    <div ref={uploaderRef} style={{ width: "100%" }}>
                        {/* Tool Navigation */}
                        <div className={styles.toolsSection}>
                            <h2 className={styles.toolsTitle}>Specialized Tools</h2>
                            <div className={styles.toolsGrid}>
                                <div className={styles.toolCard}>
                                    <FileText className={styles.toolIcon} />
                                    <h3>AI Resume Tailor</h3>
                                    <p>Upload your resume and a job description to create a tailor-made resume powered by our super intelligent ai engine</p>
                                    <Button onClick={() => router.push("/free-ai-tools/resume-tailor")}>Try AI Tailor</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div ref={uploaderRef} style={{ width: "100%" }}>
                        {/* Tool Navigation */}
                        <div className={styles.toolsSection}>
                            <h2 className={styles.toolsTitle}>Specialized Tools</h2>
                            <div className={styles.toolsGrid}>
                                <div className={styles.toolCard}>
                                    <FileText className={styles.toolIcon} />
                                    <h3>AI Resume Tailor</h3>
                                    <p>
                                        Upload your resume and a job description to create a new beautiful, customizable onliine resume that you can adjust with colours, profile image and edit the content right in the
                                        browser
                                    </p>
                                    <Button onClick={() => router.push("/free-ai-tools/resume-tailor")}>Try Instant Ai Resume Builder</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {currentView === "view" && resumeData && (
                <div className="resumeContainer">
                    {error && <div className="errorMessage">Error: {error}</div>}
                    <ResumeDisplayButtons
                        onDownloadPdf={handleDownloadPdf}
                        onEditResume={handleEditResume}
                        onUploadNew={handleReset}
                        showDownload={true}
                        showEdit={true}
                        showLibrary={false}
                        showUploadNew={true}
                        isAuthenticated={false}
                        maxMobileButtons={2}
                    />
                    <ResumeDisplayWithSwitcher
                        resumeData={{
                            ...resumeData,
                            customColors: localCustomColors,
                            skills:
                                typeof resumeData.skills === "object" && resumeData.skills !== null && !Array.isArray(resumeData.skills)
                                    ? resumeData.skills
                                    : {
                                        // TODO: -- Find out what skills has to be once and for all
                                        // @ts-expect-error
                                        all: Array.isArray(resumeData.skills) ? resumeData.skills : [],
                                    },
                        }}
                        isAuth={true}
                    />
                </div>
            )}

            {currentView === "edit" && resumeData && <ResumeEditor resumeData={resumeData} onSave={handleSaveEdits} onCancel={handleCancelEdit} onCustomColorsChange={setLocalCustomColors} />}
        </main>
    )
}
