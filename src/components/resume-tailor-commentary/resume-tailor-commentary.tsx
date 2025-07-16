import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import styles from './resume-tailor-commentary.module.css';
// @ts-ignore - this is expected
import { Wand } from 'lucide-react';

interface ResumeTailorCommentaryProps {
  aiTailorCommentary: string | null; // Renamed from aiSummary
}

const ResumeTailorCommentary: React.FC<ResumeTailorCommentaryProps> = ({
  aiTailorCommentary,
}) => {
  if (!aiTailorCommentary) {
    return null;
  }
  return (
    <Card className={styles.card}>
      <CardHeader className={styles.cardHeader}>
        <div className={styles.cardHeaderContent}>
          <Wand />
          <h2 className={styles.title}>AI Insights</h2>
        </div>
      </CardHeader>
      <CardContent className={styles.cardContent}>
        <p className={styles.summaryText}>{aiTailorCommentary}</p>
      </CardContent>
    </Card>
  );
};

export default ResumeTailorCommentary;
