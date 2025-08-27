import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: "/api/",
			},
			{
				userAgent: ["Mediapartners-Google", "Google-Display-Ads-Bot"],
				allow: "/",
			},
		],
		sitemap: "https://www.airesumegen.com/sitemap.xml",
	}
}
