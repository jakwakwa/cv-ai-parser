'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <any>
    adsbygoogle: any[];
  }
}

interface AdSenseUnitProps {
  slot: string;
  format?: string;
  fullWidthResponsive?: boolean;
}

export function AdSenseUnit({
  slot,
  format = 'auto',
  fullWidthResponsive = true,
}: AdSenseUnitProps) {
  const adUnitRef = useRef<HTMLModElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <the dependency is crucial>
  useEffect(() => {
    // Check if the container is mounted and has a non-zero width
    if (adUnitRef.current && adUnitRef.current.offsetWidth > 0) {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      } catch (e) {
        console.error('Adsense error', e);
      }
    }
  }, [slot]); // Add slot to the dependency array, as it's used to identify the ad unit.

  // Determine effective style
  const effectiveStyle: React.CSSProperties = { display: 'block' };
  if (format === 'auto') {
    effectiveStyle.minWidth = '250px';
    effectiveStyle.minHeight = '250px';
  }

  return (
    <ins
      className="adsbygoogle"
      style={effectiveStyle}
      data-ad-client="ca-pub-7169177467099391"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      key={slot}
      ref={adUnitRef} // Assign the ref to the ins element
    />
  );
}
