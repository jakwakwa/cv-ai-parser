import { JsonLd } from "@/src/components/seo/JsonLd"
import { SITE } from "@/src/lib/seo/config"
import { buildPageMetadata } from "@/src/lib/seo/metadata"
import { buildBreadcrumbSchema, buildFAQSchema, buildSoftwareAppSchema } from "@/src/lib/seo/schemas"
import ClientPage from "./ClientPage"

export const metadata = buildPageMetadata({
    title: "AI Resume Tailor – Match Your Resume to Any Job Post",
    description: "Paste a job description and instantly tailor your resume with AI to boost ATS matching and recruiter relevance.",
    path: "/free-ai-tools/resume-tailor",
    keywords: ["AI-powered resume optimization", "tailor resume to job post", "resume keyword matching", "boost ATS score"],
})

export default function Page() {
    const breadcrumbs = [
        { name: "Home", item: SITE.baseUrl },
        { name: "Tools", item: `${SITE.baseUrl}/tools` },
        { name: "AI Resume Tailor", item: `${SITE.baseUrl}/free-ai-tools/resume-tailor` },
    ]

    const faq = [
        { question: "How does tailoring work?", answer: "We analyze your job description and align resume keywords and phrasing to improve ATS relevance." },
        { question: "Will it change my formatting?", answer: "The tool keeps clean structure suitable for ATS while refining content and sections." },
        { question: "Is my data private?", answer: "We do not share your content and use secure processing. See the Privacy Policy for details." },
    ]

    return (
        <>
            <JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
            <JsonLd
                data={buildSoftwareAppSchema({
                    name: "AI Resume Tailor",
                    description: "Optimize your resume for specific job descriptions using AI keyword matching and formatting.",
                    path: "/free-ai-tools/resume-tailor",
                    operatingSystem: "Web",
                    applicationCategory: "BusinessApplication",
                })}
            />
            <JsonLd data={buildFAQSchema(faq)} />
            <ClientPage />
        </>
    )
}
