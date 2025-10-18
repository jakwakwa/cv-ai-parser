
import { Suspense } from "react"
import { SiteHeader } from "@/src/components/site-header/site-header"
import { JsonLd } from "@/src/components/seo/JsonLd"
import { buildBreadcrumbSchema } from "@/src/lib/seo/schemas"
import { buildPageMetadata } from "@/src/lib/seo/metadata"
import { SITE } from "@/src/lib/seo/config"
import PageContent from "@/src/containers/page-content"
import styles from "./page.module.css"

export const metadata = buildPageMetadata({
    title: "Upload Resume (Private Flow)",
    description: "Upload your resume to generate or tailor it. This page is not indexed by search engines.",
    path: "/upload",
    robotsIndex: false,
})

const breadcrumbs = [
    { name: "Home", item: SITE.baseUrl },
    { name: "Upload", item: `${SITE.baseUrl}/upload` },
]

export default function UploadPage() {
    return (
        <div className={styles.pageWrapper}>
            <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
            <SiteHeader
                onLogoClick={() => {
                    window.location.href = "/"
                }}
            />
            <main className={styles.mainContent}>
                <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
                    <PageContent />
                </Suspense>
            </main>
        </div>
    )
}
