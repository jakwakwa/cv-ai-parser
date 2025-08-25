import {
  ArrowRight,
  Bot,
  FileText as BriefcaseIcon,
  Palette,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
// ContentAd removed for better content compliance
//   import HomeToolItem from '@/src/components/home-tool-item';
import { Button } from '@/src/components/ui/ui-button/button';
import styles from './home-tool-item.module.css';

interface HomeToolItemContent {
  title: string;
  description: string;
}

interface HomeToolItemProps {
  content: HomeToolItemContent;
  link: string;
}

function HomeToolItem({ content, link }: HomeToolItemProps) {
  const router = useRouter();
  return (
    <section className={styles.features}>
      <div className={styles.featuresGrid}>
        {/* Resume Tailor Card */}
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>{content.title}</h3>
          <p className={styles.featureDescription}>{content.description}</p>

          <div className={styles.featureHighlights}>
            <div className={styles.highlight}>
              <Upload size={16} />
              <span>Upload PDF or TXT</span>
            </div>
            <div className={styles.highlight}>
              <BriefcaseIcon size={16} />
              <span>Paste job description</span>
            </div>
            <div className={styles.highlight}>
              <Bot size={16} />
              <span>AI optimization</span>
            </div>
            <div className={styles.highlight}>
              <Palette size={16} />
              <span>Custom styling</span>
            </div>
          </div>

          <Button
            variant="primary"
            className={styles.featureButton}
            onClick={() => router.push(`${link}`)}
          >
            Start Tailoring
            <ArrowRight size={16} />
          </Button>
        </div>

        {/* Additional content space reserved for future features */}
      </div>
    </section>
  );
}

export default HomeToolItem;
