import { SITE } from "./config"
import type { ArticleSEO, BreadcrumbItem, FAQItem, SoftwareAppSEO } from "./types"

/**
 * Build Organization schema for the company/publisher
 */
export const buildOrganizationSchema = () => ({
	"@context": "https://schema.org",
	"@type": "Organization",
	name: SITE.publisher,
	url: SITE.baseUrl,
	logo: SITE.logoSquareUrl,
	sameAs: [`https://twitter.com/${SITE.twitterHandle.replace("@", "")}`],
	contactPoint: [
		{
			"@type": "ContactPoint",
			email: SITE.contactEmail,
			contactType: "customer support",
			availableLanguage: ["en"],
		},
	],
})

/**
 * Build WebSite schema for the overall site
 */
export const buildWebSiteSchema = () => ({
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: SITE.name,
	url: SITE.baseUrl,
	inLanguage: "en",
	potentialAction: [
		{
			"@type": "SearchAction",
			target: `${SITE.baseUrl}/search?q={search_term_string}`,
			"query-input": "required name=search_term_string",
		},
	],
})

/**
 * Build BreadcrumbList schema for navigation breadcrumbs
 * @param items - Array of breadcrumb items with name and URL
 */
export const buildBreadcrumbSchema = (items: BreadcrumbItem[]) => ({
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: items.map((it, idx) => ({
		"@type": "ListItem",
		position: idx + 1,
		name: it.name,
		item: it.item,
	})),
})

/**
 * Build Article schema for blog posts
 * @param article - Article metadata
 */
export const buildArticleSchema = (article: ArticleSEO) => ({
	"@context": "https://schema.org",
	"@type": "Article",
	headline: article.title,
	description: article.description,
	datePublished: article.datePublished,
	dateModified: article.dateModified || article.datePublished,
	author: { "@type": "Person", name: article.authorName },
	publisher: {
		"@type": "Organization",
		name: SITE.publisher,
		logo: { "@type": "ImageObject", url: SITE.logoSquareUrl },
	},
	mainEntityOfPage: {
		"@type": "WebPage",
		"@id": `${SITE.baseUrl}${article.path}`,
	},
	image: article.ogImage ? [article.ogImage] : undefined,
	keywords: article.tags?.join(","),
})

/**
 * Build SoftwareApplication schema for tool pages
 * @param app - Software application metadata
 */
export const buildSoftwareAppSchema = (app: SoftwareAppSEO) => ({
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: app.name,
	description: app.description,
	applicationCategory: app.applicationCategory || "BusinessApplication",
	operatingSystem: app.operatingSystem || "Web",
	offers: app.offers
		? {
				"@type": "Offer",
				price: app.offers.price,
				priceCurrency: app.offers.priceCurrency,
				priceValidUntil: app.offers.priceValidUntil,
				url: `${SITE.baseUrl}${app.path}`,
			}
		: undefined,
	aggregateRating: app.aggregateRating
		? {
				"@type": "AggregateRating",
				ratingValue: app.aggregateRating.ratingValue,
				reviewCount: app.aggregateRating.reviewCount,
			}
		: undefined,
	url: `${SITE.baseUrl}${app.path}`,
})

/**
 * Build FAQPage schema for FAQ sections
 * @param faq - Array of FAQ items
 */
export const buildFAQSchema = (faq: FAQItem[]) => ({
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: faq.map((q) => ({
		"@type": "Question",
		name: q.question,
		acceptedAnswer: { "@type": "Answer", text: q.answer },
	})),
})
