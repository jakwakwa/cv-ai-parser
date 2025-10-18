import type { MetadataRoute } from "next"
import { SITE } from "@/src/lib/seo/config"

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/api/",
					"/auth/",
					"/dashboard",
					"/account",
					"/settings",
					"/resume/",
					"/resume/temp-resume/",
					"/upload",
				],
			},
			{
				userAgent: ["Mediapartners-Google", "Google-Display-Ads-Bot"],
				allow: "/",
			},
		],
		sitemap: `${SITE.baseUrl}/sitemap.xml`,
	}
}
