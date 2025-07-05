"use client";

import type React from 'react';
// @ts-ignore - react-markdown types issue
import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  children: string;
  className?: string;
}

export default function Markdown({ children, className = "vds-prose" }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}