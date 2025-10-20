"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { SiteHeader } from "@/src/components/site-header/site-header"
import HomePageContent from "../src/containers/home-page-content/home-page-content"
import styles from "./page.module.css"

function HomeContent() {
    const { toast } = useToast()
    const searchParams = useSearchParams()

    useEffect(() => {
        const authRequired = searchParams.get("auth")
        if (authRequired === "required") {
            toast({
                title: "Authentication Required",
                description: "Please sign in to access your resume library.",
                variant: "default",
            })
            // Clean up the URL
            window.history.replaceState({}, "", "/")
        }
    }, [searchParams, toast])

    return (
        <>
            <SiteHeader
                onLogoClick={() => {
                    window.location.href = "/"
                }}
            />
            <main className={styles.mainContent}>
                <div className="p-1 mx-4" >
                    {/* <HeaderAd /> */}
                </div>
                <Suspense fallback={<div className={styles.loading}>Loading...</div>}>

                    <HomePageContent />

                </Suspense>
            </main>
        </>
    )
}

export default function Home() {
    return (
        <div className={styles.pageWrapper}>
            <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
                <HomeContent />
            </Suspense>
        </div>
    )
}
