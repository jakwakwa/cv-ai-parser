import type React from "react"
import type { Metadata } from "next"
import "../styles/globals.css"
import "../src/index.css"
import { AuthProvider } from "@/components/AuthProvider"

export const metadata: Metadata = {
  title: "Resume Parser & Generator",
  description: "Upload your resume and generate a beautiful online version",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
