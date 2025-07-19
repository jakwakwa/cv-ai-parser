'use client';

import { usePathname } from 'next/navigation';
import { type FC, useEffect, useState } from 'react';
import styles from './AdBanner.module.css';

// Declare window property for global debug flag (dev only)
declare global {
  interface Window {
    __ADSENSE_DEBUG__?: boolean;
  }
}

interface Props {
  adSlot?: string;
  adClient?: string;
  adFormat?: string;
  showFallback?: boolean;
  fallbackMessage?: string;
  responsive?: boolean;
  requireContentValidation?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const AdBanner: FC<Props> = ({
  adSlot = AD_SLOTS.content,
  adClient = 'ca-pub-7169177467099391',
  adFormat = 'auto',
  showFallback = false,
  fallbackMessage = 'Advertisement',
  responsive = true,
  requireContentValidation = true, // Enable by default to ensure policy compliance
  ...props
}) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [adBlocked, setAdBlocked] = useState(false);
  const [eligibilityCheck, setEligibilityCheck] = useState<{
    eligible: boolean;
    reason?: string;
  }>({ eligible: false });
  const [contentValidation, setContentValidation] = useState<{
    isValid: boolean;
    reason?: string;
  }>({ isValid: false });

  const loadAdSenseScript = () => {
    if (typeof window !== 'undefined') {
      try {
        // Check if AdSense script is already loaded
        if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
          const script = document.createElement('script');
          script.async = true;
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }

        // Initialize ads after script loads
        setTimeout(() => {
          try {
            const adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle = adsbygoogle;
            adsbygoogle.push({});
          } catch (adError) {
            setError(true);
          }
        }, 100);
      } catch (err) {
        setError(true);
      }
    }
  };

  // Check page eligibility and content validation
  useEffect(() => {
    const checkEligibility = () => {
      // Only the most critical pages that should NEVER show ads
      for (const restrictedPath of RESTRICTED_PAGES) {
        if (pathname.startsWith(restrictedPath)) {
          return {
            eligible: false,
            reason: `Restricted page: ${restrictedPath}`,
          };
        }
      }
      return { eligible: true };
    };

    const pageEligibility = checkEligibility();
    setEligibilityCheck(pageEligibility);

    // Content validation (only if required and page is eligible)
    let validation = { isValid: true };
    if (requireContentValidation && pageEligibility.eligible) {
      validation = validatePageContent();
      setContentValidation(validation);
    } else {
      setContentValidation({ isValid: true });
    }

    // Only proceed with ad loading in production or when explicitly enabled
    if (process.env.NODE_ENV === 'production') {
      // Production: Allow ads if eligible and content is valid
      if (
        pageEligibility.eligible &&
        (validation.isValid || !requireContentValidation)
      ) {
        loadAdSenseScript();
      }
    } else {
      // Development: Block ads by default (prevents issues during development)
      setAdBlocked(true);
    }

    setLoading(false);
    // biome-ignore lint/correctness/useExhaustiveDependencies: <expected dep>
  }, [pathname, requireContentValidation, loadAdSenseScript]);

  // Don't render anything if page is not eligible
  if (!eligibilityCheck.eligible) {
    return null;
  }

  // Don't render if content validation required but failed
  if (requireContentValidation && !contentValidation.isValid) {
    return null;
  }

  // Show fallback or nothing if ad is blocked/errored
  if (adBlocked || error) {
    return showFallback ? (
      <div className={styles.fallback}>
        <span className={styles.fallbackText}>{fallbackMessage}</span>
      </div>
    ) : null;
  }

  if (loading) {
    return (
      <div className={styles.adContainer}>
        <div className={styles.loadingPlaceholder}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.adContainer} {...props}>
      <ins
        className={`adsbygoogle ${styles.adBanner}`}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};

// Only the most critical pages that should NEVER show ads
const RESTRICTED_PAGES = [
  '/404',
  '/500',
  '/error',
  '/api',
  '/admin',
  '/sitemap',
  '/robots',
] as const;

// Ad slot configurations
const AD_SLOTS = {
  header: '1234567890', // Replace with your actual ad slot IDs
  content: '0987654321',
  footer: '1122334455',
} as const;

// Much more lenient content quality checker
const validatePageContent = (): {
  isValid: boolean;
  reason?: string;
  details?: any;
} => {
  if (typeof window === 'undefined') {
    return { isValid: true }; // Allow during SSR
  }

  try {
    // Get main content area
    const mainContent = document.querySelector('main') || document.body;

    if (!mainContent) {
      return { isValid: true }; // If we can't find content, allow ads
    }

    // Count text content
    const textContent = mainContent.textContent || '';
    const cleanText = textContent.replace(/\s+/g, ' ').trim();
    const wordCount = cleanText
      .split(' ')
      .filter((word) => word.length > 2).length;

    // Much more reasonable requirements
    const headings = mainContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const paragraphs = mainContent.querySelectorAll('p');

    // Basic content requirements
    const hasMinWords = wordCount >= 50;
    const hasMinChars = cleanText.length >= 200;
    const hasStructure = headings.length > 0 && paragraphs.length > 0;

    return {
      isValid: hasMinWords && hasMinChars && hasStructure,
      reason: !hasMinWords
        ? 'Insufficient word count'
        : !hasMinChars
          ? 'Insufficient content length'
          : !hasStructure
            ? 'Missing content structure'
            : undefined,
      details: {
        wordCount,
        charCount: cleanText.length,
        headingCount: headings.length,
        paragraphCount: paragraphs.length,
      },
    };
  } catch (error) {
    return { isValid: true }; // On error, allow ads
  }
};

// Convenience components for different ad placements
export const HeaderAd: FC<Omit<Props, 'adSlot'>> = (props) => (
  <AdBanner
    adSlot={AD_SLOTS.header}
    requireContentValidation={true}
    {...props}
  />
);

export const ContentAd: FC<Omit<Props, 'adSlot'>> = (props) => (
  <AdBanner
    adSlot={AD_SLOTS.content}
    requireContentValidation={true}
    {...props}
  />
);

export const FooterAd: FC<Omit<Props, 'adSlot'>> = (props) => (
  <AdBanner
    adSlot={AD_SLOTS.footer}
    requireContentValidation={true}
    {...props}
  />
);
