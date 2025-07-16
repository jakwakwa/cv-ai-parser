import Markdown from '@/src/components/docs/Markdown';

export const dynamic = 'force-dynamic';

const md = `# Building a Resume from a Figma Design

Easily convert a Figma frame into JSX + CSS.

## Requirements

* Select a **Frame** or **Component** that represents the resume layout.
* Text layers should be named \`name\`, \`title\`, \`summary\`, etc. so the binding heuristics can detect fields.

## Steps

1. In Figma select the resume frame and press **⌘ + L** (or right-click → *Copy link*).
2. In the app, open **Generate from Figma Design** and paste the link.
3. Click **Generate Resume**.
4. The server fetches the design, creates React code, and saves it under \`src/generated-resumes\`.
5. Review the preview, tweak colours, then download or save.

## Limitations

* Repeating sections (experience, education) aren’t auto-looped yet.
* Very large frames can hit Figma render limits – link to a smaller component if you see an error.
`;

export default function Guide() {
  return <Markdown>{md}</Markdown>;
}
