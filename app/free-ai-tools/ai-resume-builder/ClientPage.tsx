"use client"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState } from "react"
// Ads temporarily removed until sufficient content is added
import ResumeGeneratorTool from "@/src/containers/tool-containers/resume-generator-tool/resume-generator-tool"
import styles from "./page.module.css"

export default function ClientPage() {
    const [isLoading, _setIsLoading] = useState(false)
    const { data: session, status } = useSession()

    // Only show ads when we're sure the user is NOT authenticated
    // Don't show during loading to prevent flashing
    const _shouldShowAds = status === "unauthenticated"

    return (
        <div className={styles.pageContainer}>
            <div className={styles.headerSection}>
                <h1 className={styles.title}>Ai Resume Builder</h1>
                <p className={styles.subtitle}>Upload your current  resume to instantly build a beautifully customised version from the original file</p>
                <Link href="/resources/guides/resume-from-file" className={styles.button}>
                    Need help getting started?
                </Link>
            </div>

            <ResumeGeneratorTool isLoading={isLoading} isAuthenticated={!!session} />
        </div>
    )
}
