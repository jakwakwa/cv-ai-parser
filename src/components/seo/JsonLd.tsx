type JsonLdProps = {
	data: unknown
}

/**
 * JsonLd component for rendering structured data as JSON-LD
 * This is a server component and safely serializes data without hydration issues
 * @param data - The schema object to serialize
 */
export function JsonLd({ data }: JsonLdProps) {
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data),
			}}
		/>
	)
}
