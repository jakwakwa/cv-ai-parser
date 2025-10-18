import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { Suspense } from "react"
import { authOptions } from "@/lib/auth"
import { ResumeDatabase } from "@/lib/db"
import type { Resume } from "@/lib/types"
import { SiteHeader } from "@/src/components/site-header/site-header"
import { JsonLd } from "@/src/components/seo/JsonLd"
import { buildBreadcrumbSchema } from "@/src/lib/seo/schemas"
import { buildPageMetadata } from "@/src/lib/seo/metadata"
import { SITE } from "@/src/lib/seo/config"
import LibraryPageContent from "./page-content"

export const metadata = buildPageMetadata({
	title: "Resume Library: Examples, Templates, and Best Practices",
	description:
		"Explore resume examples, templates, and best practices for ATS-friendly resumes across roles and industries.",
	path: "/library",
	keywords: ["resume examples", "ATS resume templates", "resume best practices", "CV examples 2024"],
})

const breadcrumbs = [
	{ name: "Home", item: SITE.baseUrl },
	{ name: "Library", item: `${SITE.baseUrl}/library` },
]

export default async function LibraryPage() {
	const session = await getServerSession(authOptions)

	// Server-side authentication protection
	if (!session?.user?.id) {
		redirect("/?auth=required")
	}

	const userId = session.user.id
	let initialResumes: Resume[] = []

	try {
		initialResumes = await ResumeDatabase.getUserResumes(userId)
	} catch (_error) {
		// Pass an empty array and let the client show an error.
	}

	return (
		<div className="pageWrapper">
			<JsonLd data={buildBreadcrumbSchema(breadcrumbs)} />
			<SiteHeader />
			<Suspense fallback={<div>Loading...</div>}>
				<LibraryPageContent initialResumes={initialResumes} />
			</Suspense>
		</div>
	)
}
