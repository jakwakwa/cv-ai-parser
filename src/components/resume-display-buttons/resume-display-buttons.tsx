"use client"
// @ts-expect-error
import { FileDown, Library, PencilRuler, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import type React from "react"
import { Button } from "@/src/components/ui/ui-button/button"
import styles from "./resume-display-buttons.module.css"

interface ButtonConfig {
    show: boolean
    label: string
    icon: React.ReactNode
    onClick: () => void
    variant?: "default" | "primary" | "secondary" | "outline"
    priority?: number // For mobile ordering (lower = higher priority)
}

interface ResumeDisplayButtonsProps {
    onDownloadPdf: () => void
    onEditResume?: () => void
    onUploadNew?: () => void
    onMyLibrary?: () => void
    // Configuration options
    showEdit?: boolean
    showLibrary?: boolean
    showUploadNew?: boolean
    showDownload?: boolean
    isAuthenticated?: boolean
    isOnResumePage?: boolean
    maxMobileButtons?: number // How many buttons to show on mobile before collapsing
}

export const ResumeDisplayButtons: React.FC<ResumeDisplayButtonsProps> = ({
    onDownloadPdf,
    onEditResume,
    onUploadNew,
    onMyLibrary,
    showEdit = false,
    showLibrary = false,
    showUploadNew = true,
    showDownload = true,
    isAuthenticated = false,
}) => {
    const router = useRouter()

    const handleUploadNew = () => {
        if (onUploadNew) {
            onUploadNew()
        } else {
            router.push("/free-ai-tools/resume-tailor")
        }
    }

    const handleMyLibrary = () => {
        if (onMyLibrary) {
            onMyLibrary()
        } else {
            router.push("/library")
        }
    }

    const handleEditResume = () => {
        if (onEditResume) {
            onEditResume()
        }
    }

    // Define all possible buttons with their configurations
    const buttons: ButtonConfig[] = [
        {
            show: showDownload,
            label: "Download",
            icon: <FileDown size={16} />,
            onClick: onDownloadPdf,
            variant: "primary",
            priority: 1, // Highest priority for mobile
        },
        {
            show: showUploadNew,
            label: "Upload New",
            icon: <Upload size={16} />,
            onClick: handleUploadNew,
            variant: "outline",
            priority: 2,
        },
        {
            show: showEdit && isAuthenticated,
            label: "Edit",
            icon: <PencilRuler size={16} />,
            onClick: handleEditResume,
            variant: "default",
            priority: 3,
        },
        {
            show: showLibrary && isAuthenticated,
            label: "Library",
            icon: <Library size={16} />,
            onClick: handleMyLibrary,
            variant: "default",
            priority: 4,
        },
    ]

    // Filter visible buttons and sort by priority
    const visibleButtons = buttons.filter(button => button.show)

    return (
        <div className={styles.buttonContainer}>
            {/* Show unauthenticated message if needed */}
            {!isAuthenticated && (showEdit || showLibrary) && (
                <div className={styles.authMessage}>
                    <span>Sign in to edit, save, or manage your resumes</span>
                </div>
            )}

            {/* Desktop: Show all buttons */}
            <div className={styles.desktopButtons}>
                {visibleButtons.map(button => (
                    <Button key={button.label} type="button" onClick={button.onClick} variant={button.variant} className={styles.actionButton}>
                        {button.icon}
                        <span>{button.label}</span>
                    </Button>
                ))}
            </div>

            {/* Mobile: Show all visible buttons in a row */}
            <div className={styles.mobileButtons}>
                {visibleButtons.map(button => (
                    <div className={styles.mobileDisplayButtonWrapper} key={button.label}>
                        <Button type="button" onClick={button.onClick} variant={button.variant} className={styles.mobileActionButton}>
                            {button.icon}
                            <span className={styles.buttonLabel}>{button.label}</span>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ResumeDisplayButtons
