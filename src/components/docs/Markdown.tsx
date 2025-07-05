"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MDProps {
  children: string;
}

export default function Markdown({ children }: MDProps) {
  return (
    <div className="vds-prose">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}