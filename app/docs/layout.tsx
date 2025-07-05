import type { ReactNode } from 'react';
import DocsLayout from '@/src/components/docs/DocsLayout';

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return <DocsLayout>{children}</DocsLayout>;
}