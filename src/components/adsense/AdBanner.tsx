import { CSSProperties, FC, useEffect, useState } from 'react';
import styles from './AdBanner.module.css';

declare global {
  interface Window {
    googletag: any;
  }
}

type Props = Pick<CSSProperties, 'height' | 'width'>;

export const AdBanner: FC<Props> = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (window.googletag && typeof window.googletag.cmd.push === 'function') {
        window.googletag.cmd.push(() => {
          window.googletag.display('my-banner');
        });
      }
      setLoading(false);
    }, 3000);
  }, []);

  // It's a good idea to use an `id` that can't be easily detected as a banneable banner.
  // That way adblockers won't remove your fallback state too and you could show a custom
  // message in that case if the ad is blocked
  return (
    <div id="my-banner" style={{ ...props }}>
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingIcon} />
          <div className={styles.loadingTextContainer}>
            <div className={styles.loadingTextLine1} />
            <div className={styles.loadingTextLine2} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
