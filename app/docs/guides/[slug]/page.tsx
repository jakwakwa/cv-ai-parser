import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface GuideContent {
  title: string;
  body: string; // simple markdown string
}

const guides: Record<string, GuideContent> = {
  'resume-from-file': {
    title: 'Uploading a Resume File',
    body: `## Overview\n\nThis guide shows you how to generate a resume from a text or PDF file.\n\n1. Click **Upload File**.\n2. Select a \`.txt\` or \`.pdf\`.\n3. Click **Create Resume**.`,
  },
  'resume-from-figma': {
    title: 'Building a Resume from a Figma Design',
    body: `## Overview\n\nPaste a Figma frame link to generate JSX + CSS.\n\n### Requirements\n\n* The frame should contain text layers labelled \`name\`, \`title\`, etc.\n* See [Template Rules](/docs/template-rules) for full list.\n\n### Steps\n\n1. Copy the frame link in Figma (\`⌘ + L\`).\n2. Paste it into **Generate from Figma Design**.\n3. Click **Generate Resume**.`,
  },
};

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = guides[params.slug];
  if (!guide) return notFound();

  return (
    <article>
      <h1>{guide.title}</h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{guide.body}</ReactMarkdown>
    </article>
  );
}