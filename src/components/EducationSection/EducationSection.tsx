import { EducationIcon } from '../Icons';
import styles from './EducationSection.module.css';

interface EducationItem {
  degree: string;
  institution: string;
  duration?: string;
  note?: string;
}

interface EducationSectionProps {
  education?: EducationItem[];
  customColors: Record<string, string>;
}

const EducationSection = ({
  education,
  customColors,
}: EducationSectionProps) => {
  const colors = customColors || {};

  return (
    <section className={styles.educationSection}>
      <h2
        className={styles.sectionTitle}
        style={{ color: colors['--charcoal'] }}
      >
        <EducationIcon fill={colors['--bronze-dark']} />
        Education
      </h2>
      {education && education.length > 0 ? (
        education.map((edu) => (
          <div
            key={`${edu.degree}-${edu.institution}`}
            className="mb-4 last:mb-0"
          >
            <p className="subject" style={{ color: colors['--teal-main'] }}>
              {edu.degree}
            </p>
            <p className="issuer" style={{ color: colors['--bronze-dark'] }}>
              {edu.institution}
            </p>
            {edu.duration && (
              <p className="date" style={{ color: colors['--charcoal'] }}>
                {edu.duration}
              </p>
            )}
            {edu.note && (
              <p
                className={styles.detail}
                style={{ color: colors['--coffee'] }}
              >
                {edu.note}
              </p>
            )}
          </div>
        ))
      ) : (
        <p
          className="text-gray-600 text-sm"
          style={{ color: colors['--coffee'] }}
        >
          No education details available.
        </p>
      )}
    </section>
  );
};

export default EducationSection;
