import { EducationIcon } from '../resume-display-icons';
import styles from './education-section.module.css';

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
  // const colors = customColors || {};

  return (
    <section className={styles.educationSection}>
      <h2
        className={styles.sectionTitle}
        style={{ color: customColors['--resume-section-titles'] }}
      >
        <EducationIcon fill={customColors['--resume-main-icons']} />
        Education
      </h2>
      {education && education.length > 0 ? (
        education.map((edu) => (
          <div
            key={`${edu.degree}-${edu.institution}`}
            className={styles.educationItem}
          >
            <p
              className="subject"
              style={{ color: customColors['--resume-job-title'] }}
            >
              {edu.degree}
            </p>
            <p
              className="issuer"
              style={{ color: customColors['--resume-main-icons'] }}
            >
              {edu.institution}
            </p>
            {edu.duration && (
              <p
                className="date"
                style={{ color: customColors['--resume-dates'] }}
              >
                {edu.duration}
              </p>
            )}
            {edu.note && (
              <p
                className={styles.detail}
                style={{ color: customColors['--resume-body-text'] }}
              >
                {edu.note}
              </p>
            )}
          </div>
        ))
      ) : (
        <p
          className={styles.emptyState}
          style={{ color: customColors['--resume-body-text'] }}
        >
          No education details available.
        </p>
      )}
    </section>
  );
};

export default EducationSection;
