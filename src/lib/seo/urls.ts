import { BASE_URL } from "./config"

/**
 * Generates a canonical URL for a given path
 * @param path - The path to generate canonical URL for (e.g., '/blog/post-1')
 * @returns Full canonical URL
 */
export const getCanonicalUrl = (path: string): string => {
	const clean = path.startsWith("/") ? path : `/${path}`
	return `${BASE_URL}${clean}`
}
