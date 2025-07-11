'use client';

// @ts-ignore - react-markdown types issue
import ReactMarkdown from 'react-markdown';
import styles from './markdown-content.module.css';

interface MarkdownProps {
  children: string;
  className?: string;
}

export default function Markdown({ children, className }: MarkdownProps) {
  const wrapperClass = className || styles.markdownContent;
  return (
    <div className={wrapperClass}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
