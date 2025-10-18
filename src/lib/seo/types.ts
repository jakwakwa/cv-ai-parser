export type PageSEO = {
	title: string
	description: string
	path: string // e.g., '/blog/resume-writing-tips'
	keywords?: string[]
	ogImage?: string // absolute URL
	robotsIndex?: boolean // default true
}

export type ArticleSEO = {
	title: string
	description: string
	path: string
	authorName: string
	datePublished: string // ISO format
	dateModified?: string // ISO format
	tags?: string[]
	ogImage?: string
}

export type SoftwareAppSEO = {
	name: string
	description: string
	path: string
	operatingSystem?: string // e.g., 'Web'
	applicationCategory?: string // e.g., 'BusinessApplication'
	offers?: {
		price: string
		priceCurrency: string
		priceValidUntil?: string
	}
	aggregateRating?: {
		ratingValue: string
		reviewCount: string
	}
}

export type FAQItem = {
	question: string
	answer: string
}

export type BreadcrumbItem = {
	name: string
	item: string
}
