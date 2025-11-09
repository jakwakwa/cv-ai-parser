import type { Metadata, Viewport } from "next"
import type React from "react"
import "../styles/globals.css"
import "../src/index.css"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import { ToastProvider } from "@/hooks/use-toast"
import { AuthModalProvider } from "@/src/components/auth-component/AuthModalContext"
import AuthProvider from "@/src/components/auth-provider/auth-provider"
import { JsonLd } from "@/src/components/seo/JsonLd"
import { SiteFooter } from "@/src/components/site-footer/SiteFooter"
import { Toaster } from "@/src/components/ui/toaster"
import { TempResumeProvider } from "@/src/hooks/use-temp-resume-store"
import { ThemeProvider } from "@/src/hooks/use-theme"
import { SITE } from "@/src/lib/seo/config"
import { buildOrganizationSchema, buildWebSiteSchema } from "@/src/lib/seo/schemas"
import { TemplateProvider } from "@/src/stores/template-context"

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
}

export const metadata: Metadata = {
    metadataBase: new URL(SITE.baseUrl),
    title: {
        default: "AI Resume Parser & Online CV Generator - Convert to PDF with Custom Colors",
        template: `%s | ${SITE.name}`,
    },
    description: "Effortlessly convert your text resumes into stunning online CVs using AI-powered parsing. Customize with beautiful colors, download as PDF, and manage your professional presence.",
    keywords: [
        "Instant Ai Resume Builder",
        "Ai resume parser",
        "Tailor your resume with AI",
        "AI resume job specification tailor",
        "AI resume tailor to job specifications",
        "AI resume tailor to job description",
        "AI resume tailor to job requirements",
        "AI resume tailor to job skills",
        "AI resume tailor to job experience",
        "AI resume tailor to job education",
        "AI resume tailor to job certifications",
        "AI resume tailor to job projects",
        "AI resume tailor to job achievements",
        "AI resume tailor to job responsibilities",
        "online resume generator",
        "Free OnlineCV builder",
        "CV generator",
        "CV editor",
        "CV formatter",
        "CV maker",
        "CV creator",
        "CV editor",
        "CV formatter",
        "CV maker",
        "CV creator",
        "Free AI CV generator",
        "Free AI CV parser",
        "Free AI CV editor",
        "Free AI CV maker",
        "Free AI CV creator",
        "Free AI CV editor",
        "Resume pdf parser and generator",
        "PDF resume",
        "customizable resume",
        "customizable CV",
        "AI resume converter",
        "AI CV converter",
        "professional CV",
        "professional resume",
        "resume templates",
        "cv templates",
        "text to resume",
        "free AI resume builder",
        "free AI resume maker",
        "free AI resume creator",
        "free AI resume editor",
        "free AI resume formatter",
    ],
    alternates: {
        canonical: SITE.baseUrl,
    },
    openGraph: {
        title: "Instant Ai Resume Builder & Jobfit Tailor Tool - Convert to PDF with Custom Colors",
        description:
            "Easily and quickly create new modern resumés from your existing resume or tailor them to multiple job specifications. Customize a resumé or cv with beautiful colors, four modern design templates to choose from, share online or download as PDF. Save and Update multiple versions.",
        url: SITE.baseUrl,
        siteName: SITE.name,
        locale: SITE.locale,
        type: "website",
        images: [
            {
                url: "/opengraph-home.png",
                width: 1200,
                height: 630,
                alt: "Instant Ai Resume Builder",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: SITE.twitterHandle,
        creator: SITE.twitterHandle,
        title: "Easily and quickly create new modern resumés from your existing resume or tailor them to multiple job specifications.",
        description:
            "Customize a resumé or cv with beautiful colors, four modern design templates to choose from, tailor them to multiple job specifications and share online or download as PDF. Save and Update multiple versions.",
        images: [
            {
                url: "/opengraph-home.png",
                width: 1200,
                height: 630,
                alt: "Instant Ai Resume Builder",
            },
        ],
    },
    authors: [{ name: SITE.publisher }],
    applicationName: SITE.name,
    category: "Business",
    other: {
        "google-adsense-account": "ca-pub-7169177467099391",
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
                <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" />
            </head>
            <body>
                {/* Google AdSense: move to body to avoid head attribute warnings */}
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7169177467099391"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
                <JsonLd data={buildOrganizationSchema()} />
                <JsonLd data={buildWebSiteSchema()} />
                <ThemeProvider>
                    <AuthProvider>
                        <AuthModalProvider>
                            <TempResumeProvider>
                                <TemplateProvider>
                                    <ToastProvider>
                                        <div
                                            style={{
                                                minHeight: "100vh",
                                                minWidth: "100vw",
                                                display: "flex",
                                                flexDirection: "column",
                                            }}>
                                            {children}
                                            <SiteFooter />
                                        </div>
                                        <Toaster />
                                    </ToastProvider>
                                </TemplateProvider>
                            </TempResumeProvider>
                        </AuthModalProvider>
                    </AuthProvider>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    )
}
