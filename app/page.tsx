'use client';

import { Suspense } from 'react';
import { AdBanner } from '@/src/components/adsense/AdBanner';
import { SiteHeader } from '@/src/components/site-header/site-header';
import PageContent from '../src/containers/page-content';

export default function Home() {
  return (
    <div className="pageWrapper">
      <SiteHeader onLogoClick={() => window.location.reload()} />
      <div
        className="container"
        style={{ maxWidth: '728px', margin: '0 auto', padding: '20px' }}
      >
        <AdBanner width="100%" height="90px" />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <PageContent />
      </Suspense>
    </div>
  );
}
