import styles from './ExperienceSection.module.css';
import './avoidBreak.css';

interface ExperienceItem {
  title?: string;
  company?: string;
  duration?: string;
  details: string[];
}

interface ExperienceSectionProps {
  experience: ExperienceItem[];
  customColors: Record<string, string>;
}

const ExperienceSection = ({
  experience,
  customColors,
}: ExperienceSectionProps) => {
  // const colors = customColors || {};

  return (
    <section className={styles.experienceSection}>
      <h2
        className={styles.sectionTitle}
        style={{ color: customColors['--resume-section-titles'] }}
      >
        Experience
      </h2>
      {experience.length > 0 ? (
        experience.map((job, index) => (
          <div
            key={`${job.company}-${job.title}-${index}`}
            className={`${styles.experienceItem} avoid-break`}
          >
            <div className={styles.jobHeader}>
              <div>
                <h3
                  className={styles.jobTitle}
                  style={{ color: customColors['--resume-job-title'] }}
                >
                  {job.title}
                </h3>
                {job.company && (
                  <p
                    className={styles.company}
                    style={{ color: customColors['--resume-main-icons'] }}
                  >
                    {job.company}
                  </p>
                )}
                {job.duration && (
                  <p
                    className={styles.duration}
                    style={{ color: customColors['--resume-dates'] }}
                  >
                    {job.duration}
                  </p>
                )}
              </div>
            </div>
            {job.details && job.details.length > 0 && (
              <ul className={styles.details}>
                {job.details.map((detail) => (
                  <li
                    key={detail}
                    className={`${styles.detailItem} bullet-point content-body`}
                    style={{ color: customColors['--resume-body-text'] }}
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p
          className={styles.noExperienceMessage}
          style={{ color: customColors['--resume-body-text'] }}
        >
          No experience details available.
        </p>
      )}
    </section>
  );
};

export default ExperienceSection;
