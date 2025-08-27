"use client"
import { useEffect, useState } from "react"
import styles from "./DocsLayout.module.css"

interface Entry {
	id: string
	text: string
}

export default function TOC() {
	const [entries, setEntries] = useState<Entry[]>([])

	useEffect(() => {
		const selector = "main h2, main h3"
		const nodes = Array.from(document.querySelectorAll(selector))
		const items: Entry[] = nodes.map((n, index) => {
			// If the heading doesn't have an ID, generate one and assign it
			if (!n.id) {
				n.id = `heading-${index}`
			}
			return {
				id: n.id,
				text: n.textContent || "",
			}
		})
		setEntries(items)

		const io = new IntersectionObserver(
			obs => {
				obs.forEach(entry => {
					const link = document.querySelector<HTMLAnchorElement>(`a[href="#${entry.target.id}"]`)
					if (!link) return
					if (entry.isIntersecting) {
						link.setAttribute("aria-current", "true")
					} else {
						link.removeAttribute("aria-current")
					}
				})
			},
			{ rootMargin: "-40% 0px -55% 0px", threshold: 0 }
		)
		nodes.forEach(n => io.observe(n))

		return () => {
			nodes.forEach(n => io.unobserve(n))
		}
	}, [])

	if (entries.length === 0) return null
	return (
		<div className={styles.toc}>
			<ul>
				{entries.map(e => (
					<li key={e.id}>
						<a href={`#${e.id}`} className={styles.tocLink}>
							{e.text}
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}
