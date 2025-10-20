import type { Metadata, Viewport } from "next";
import type React from "react";
import "../styles/globals.css";
import "../src/index.css";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { ToastProvider } from "@/hooks/use-toast";
import { AuthModalProvider } from "@/src/components/auth-component/AuthModalContext";
import AuthProvider from "@/src/components/auth-provider/auth-provider";
import { SiteFooter } from "@/src/components/site-footer/SiteFooter";
import { Toaster } from "@/src/components/ui/toaster";
import { TempResumeProvider } from "@/src/hooks/use-temp-resume-store";
import { ThemeProvider } from "@/src/hooks/use-theme";
import { JsonLd } from "@/src/components/seo/JsonLd";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/src/lib/seo/schemas";
import { SITE } from "@/src/lib/seo/config";
import { TemplateProvider } from "@/src/stores/template-context";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.baseUrl),
  title: {
    default:
      "AI Resume Parser & Online CV Generator - Convert to PDF with Custom Colors",
    template: `%s | ${SITE.name}`,
  },
  description:
    "Effortlessly convert your text resumes into stunning online CVs using AI-powered parsing. Customize with beautiful colors, download as PDF, and manage your professional presence.",
  keywords: [
    "AI resume parser",
    "online resume generator",
    "CV builder",
    "PDF resume",
    "customizable resume",
    "AI resume converter",
    "professional CV",
    "resume template",
    "job application tool",
    "text to resume",
  ],
  alternates: {
    canonical: SITE.baseUrl,
  },
  openGraph: {
    title:
      "AI Resume Parser & Online CV Generator - Convert to PDF with Custom Colors",
    description:
      "Effortlessly convert your text resumes into stunning online CVs using AI-powered parsing. Customize with beautiful colors, download as PDF, and manage your professional presence.",
    url: SITE.baseUrl,
    siteName: SITE.name,
    locale: SITE.locale,
    type: "website",
    images: [
      {
        url: "/opengraph-home.png",
        width: 1200,
        height: 630,
        alt: "AI Resume Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE.twitterHandle,
    creator: SITE.twitterHandle,
    title:
      "AI Resume Parser & Online CV Generator - Convert to PDF with Custom Colors",
    description:
      "Effortlessly convert your text resumes into stunning online CVs using AI-powered parsing. Customize with beautiful colors, download as PDF, and manage your professional presence.",
    images: [
      {
        url: "/opengraph-home.png",
        width: 1200,
        height: 630,
        alt: "AI Resume Generator",
      },
    ],
  },
  authors: [{ name: SITE.publisher }],
  applicationName: SITE.name,
  category: "Business",
  other: {
    "google-adsense-account": "ca-pub-7169177467099391",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7169177467099391"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body>
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
                      }}
                    >
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
  );
}
