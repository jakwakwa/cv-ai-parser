'use client';

import { useEffect, useRef } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  fullWidthResponsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    // biome-ignore lint/suspicious/noExplicitAny: <any>
    adsbygoogle: any[];
  }
}

const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  adStyle = { display: 'block' },
  fullWidthResponsive = true,
  className = '',
}) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width > 0) {
          loadAd();
          observer.unobserve(entry.target);
        }
      }
    });

    const loadAd = () => {
      try {
        if (typeof window !== 'undefined') {
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
        }
      } catch (error) {
        console.error('AdSense error:', error);
      }
    };

    observer.observe(adContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .adslot_1 {
          width: 320px;
          height: 100px;
        }
        @media (min-width: 500px) {
          .adslot_1 {
            width: 468px;
            height: 60px;
          }
        }
        @media (min-width: 800px) {
          .adslot_1 {
            width: 728px;
            height: 90px;
          }
        }
      `}</style>
      <div
        className={`adsense-container adslot_1 ${className}`}
        ref={adContainerRef}
      >
        <ins
          className="adsbygoogle"
          style={adStyle}
          data-ad-client="ca-pub-7169177467099391"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive}
          key={adSlot}
        />
      </div>
    </>
  );
};

export default AdSense;
