export const BASE_URL =
	process.env.NEXT_PUBLIC_BASE_URL || "https://www.airesumegen.com"

export const SITE = {
	name: "AI Resume Parser & CV Generator",
	domain: "airesumegen.com",
	baseUrl: BASE_URL,
	defaultDescription:
		"Build an ATS-friendly resume PDF and tailor your CV with AI-powered parsing and optimization.",
	locale: "en_US",
	language: "en",
	logoUrl: `${BASE_URL}/logo.png`,
	logoSquareUrl: `${BASE_URL}/logo-square.png`,
	twitterHandle: "@airesumegen",
	contactEmail: "support@airesumegen.com",
	publisher: "AI Resume Generator",
}
