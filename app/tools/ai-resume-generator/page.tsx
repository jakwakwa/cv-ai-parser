import { JsonLd } from "@/src/components/seo/JsonLd"
import { buildBreadcrumbSchema, buildFAQSchema, buildSoftwareAppSchema } from "@/src/lib/seo/schemas"
import { buildPageMetadata } from "@/src/lib/seo/metadata"
import { SITE } from "@/src/lib/seo/config"
import ClientPage from "./ClientPage"

export const metadata = buildPageMetadata({
	title: "AI Resume Generator – Create ATS-Friendly Resume PDFs Online",
	description:
		"Generate a professional, ATS-friendly resume PDF with AI. Parse your CV, tailor to job descriptions, and export clean formats.",
	path: "/tools/ai-resume-generator",
	keywords: [
		"ATS-friendly resume builder",
		"free online CV generator",
		"AI resume parser for job seekers",
		"resume PDF customization",
	],
})

export default function Page() {
	const breadcrumbs = [
		{ name: "Home", item: SITE.baseUrl },
		{ name: "Tools", item: `${SITE.baseUrl}/tools` },
		{ name: "AI Resume Generator", item: `${SITE.baseUrl}/tools/ai-resume-generator` },
	]

	const faq = [
		{ question: "What makes a resume ATS-friendly?", answer: "Clean formatting, standard section headers, and relevant keywords help ATS parsing and ranking." },
		{ question: "Can I export as PDF?", answer: "Yes. Generate or tailor your resume and download a clean, printer-friendly PDF." },
		{ question: "Is this free?", answer: "A free tier is available for basic generation. Premium features may be added later." },
		{ question: "Does it work internationally?", answer: "Yes. It supports global roles and can adapt to region-specific resume conventions." },
	]

	return (
		<>
			<JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
			<JsonLd
				data={buildSoftwareAppSchema({
					name: "AI Resume Generator",
					description: "AI-powered tool to generate ATS-friendly resumes and tailored CVs as PDF.",
					path: "/tools/ai-resume-generator",
					operatingSystem: "Web",
					applicationCategory: "BusinessApplication",
				})}
			/>
			<JsonLd data={buildFAQSchema(faq)} />
			<ClientPage />
		</>
	)
}
