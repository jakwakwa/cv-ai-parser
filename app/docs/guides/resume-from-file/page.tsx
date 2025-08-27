import Markdown from "@/src/components/docs/Markdown"

export const dynamic = "force-dynamic"

const md = `
# Uploading a Resume File

This guide walks you through turning a plain text or PDF resume into an online document.

## Steps

1. From the home page click **Upload Resume**.
2. Select a \`.txt\` or \`.pdf\` containing your resume.
3. Click **Create Resume** – the parser will extract your details and show a preview.
4. Use the colour picker to personalise the theme.
5. Download as PDF or save to your library.

## Tips for best results

* PDFs should contain selectable text (not scanned images).
* Keep section headings like **Experience**, **Education**, **Skills** so the AI can recognise sections.
* For privacy, remove sensitive information you don’t want stored.
`

export default function Guide() {
	return <Markdown>{md}</Markdown>
}
