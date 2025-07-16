import type { EnhancedParsedResume } from '@/lib/resume-parser/enhanced-schema';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import ResumeDisplay from '../../resume-display/resume-display';
import styles from './resume-preview.module.css';

interface ResumePreviewProps {
  resumeData: ParsedResume;
}

const ResumePreview = ({ resumeData }: ResumePreviewProps) => {
  const enhancedData: EnhancedParsedResume = {
    ...resumeData,
    experience: (resumeData.experience || []).map((exp) => ({
      ...exp,
      details: (exp.details || []).filter((d): d is string => !!d),
    })),
    customColors: resumeData.customColors || {},
  };

  return (
    <div className={styles.previewContainer}>
      <ResumeDisplay resumeData={enhancedData} isAuth={false} />
    </div>
  );
};

export default ResumePreview;
