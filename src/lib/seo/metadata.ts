import type { Metadata } from "next"
import { SITE } from "./config"
import { getCanonicalUrl } from "./urls"
import type { PageSEO } from "./types"

/**
 * Builds Next.js Metadata object with consistent SEO settings
 * @param opts - PageSEO configuration object
 * @returns Metadata object for Next.js page
 */
export function buildPageMetadata(opts: PageSEO): Metadata {
	const {
		title,
		description,
		path,
		keywords = [],
		ogImage,
		robotsIndex = true,
	} = opts

	const url = getCanonicalUrl(path)
	const image = ogImage || `${SITE.baseUrl}/opengraph-home.png`

	return {
		metadataBase: new URL(SITE.baseUrl),
		title: {
			default: title,
			template: `%s | ${SITE.name}`,
		},
		description,
		keywords,
		alternates: { canonical: url },
		robots: robotsIndex ? "index,follow" : "noindex,nofollow",
		openGraph: {
			type: "website",
			url,
			title,
			description,
			siteName: SITE.name,
			images: [{ url: image }],
			locale: SITE.locale,
		},
		twitter: {
			card: "summary_large_image",
			site: SITE.twitterHandle,
			creator: SITE.twitterHandle,
			title,
			description,
			images: [image],
		},
		authors: [{ name: SITE.publisher }],
		applicationName: SITE.name,
		category: "Business",
	}
}
