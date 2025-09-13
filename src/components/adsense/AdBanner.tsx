"use client"

import { usePathname } from "next/navigation"
import { type FC, useCallback, useEffect, useState } from "react"
import styles from "./AdBanner.module.css"

interface Props {
	adSlot?: string
	adClient?: string
	adFormat?: string
	showFallback?: boolean
	fallbackMessage?: string
	responsive?: boolean
	className?: string
	style?: React.CSSProperties
}

export const AdBanner: FC<Props> = ({
	adSlot = AD_SLOTS.content,
	adClient = "ca-pub-7169177467099391",
	adFormat = "auto",
	showFallback = true, // Default to true to prevent white space
	fallbackMessage = "Advertisement",
	responsive = true,
	...props
}) => {
	const pathname = usePathname()
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [adLoaded, setAdLoaded] = useState(false)

	const loadAdSenseScript = useCallback(() => {
		if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
			try {
				// Check if AdSense script is already loaded
				if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
					const script = document.createElement("script")
					script.async = true
					script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`
					script.crossOrigin = "anonymous"
					document.head.appendChild(script)
				}

				// Initialize ads after script loads
				setTimeout(() => {
					try {
						if (typeof window !== "undefined") {
							// biome-ignore lint/suspicious/noExplicitAny: <fuck knows>
							const adsbygoogle = (window as any).adsbygoogle || []
							adsbygoogle.push({})
						}
						// Set a timeout to detect if ads fail to load
						setTimeout(() => {
							if (!adLoaded) {
								setError(true)
								setLoading(false)
							}
						}, 2000) // 2 second timeout - faster collapse
					} catch (_adError) {
						setError(true)
						setLoading(false)
					}
				}, 100)
			} catch (_err) {
				setError(true)
				setLoading(false)
			}
		}
	}, [adClient, adLoaded])

	useEffect(() => {
		// Check if page is restricted
		const isRestricted = RESTRICTED_PAGES.some(path => pathname.startsWith(path))

		// Additional content validation before showing ads
		const hasMinimumContent = () => {
			if (typeof window === "undefined") return false
			const mainContent = document.querySelector("main")
			if (!mainContent) return false
			const textContent = mainContent.textContent || ""
			return textContent.trim().length >= 500 // Minimum 500 characters
		}

		if (!isRestricted && hasMinimumContent()) {
			loadAdSenseScript()

			// Listen for ad load events
			const handleAdLoad = () => {
				setAdLoaded(true)
				setLoading(false)
				setError(false)
			}

			// Check if ads loaded after a short delay
			const checkAdLoad = setTimeout(() => {
				const adElements = document.querySelectorAll(".adsbygoogle")
				if (adElements.length > 0) {
					handleAdLoad()
				}
			}, 1000) // 1 second timeout - faster collapse

			return () => clearTimeout(checkAdLoad)
		}

		setLoading(false)
	}, [pathname, loadAdSenseScript])

	// Don't render on restricted pages
	if (RESTRICTED_PAGES.some(path => pathname.startsWith(path))) {
		return null
	}

	// Don't show ads in development
	if (process.env.NODE_ENV !== "production") {
		return showFallback ? (
			<div className={styles.fallback}>
				<span className={styles.fallbackText}>{fallbackMessage}</span>
			</div>
		) : null
	}

	// Don't show anything if ad failed to load - this prevents white space
	if (error || !(loading || adLoaded)) {
		return null
	}

	if (loading) {
		return (
			<div className={styles.adContainer}>
				<div className={styles.loadingPlaceholder}>Loading...</div>
			</div>
		)
	}

	return (
		<div className={styles.adContainer} {...props}>
			<ins
				className={`adsbygoogle ${styles.adBanner}`}
				style={{
					display: "block",
					width: "100%",
					height: "auto",
				}}
				data-ad-client={adClient}
				data-ad-slot={adSlot}
				data-ad-format={adFormat}
				data-full-width-responsive={responsive ? "true" : "false"}
			/>
		</div>
	)
}

// Restricted pages where ads should never show - expanded for better compliance
const RESTRICTED_PAGES = [
	"/404",
	"/500",
	"/error",
	"/api",
	"/admin",
	"/sitemap",
	"/robots",
	"/auth",
	"/login",
	"/register",
	"/thank-you",
	"/loading",
	"/tools", // Restrict tool pages until we add more content
] as const

// Ad slot configurations
const AD_SLOTS = {
	header: "9667986278",
	content: "7560041144",
	footer: "9100353525",
} as const

// Convenience components for different ad placements
export const HeaderAd: FC<Omit<Props, "adSlot">> = props => <AdBanner adSlot={AD_SLOTS.header} {...props} />

export const ContentAd: FC<Omit<Props, "adSlot">> = props => <AdBanner adSlot={AD_SLOTS.content} {...props} />

export const FooterAd: FC<Omit<Props, "adSlot">> = props => <AdBanner adSlot={AD_SLOTS.footer} {...props} />
